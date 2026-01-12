import { createClient } from 'contentful';
import type { Document } from '@contentful/rich-text-types';
import { BLOCKS } from '@contentful/rich-text-types';

// Types for our Contentful content model
export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  body: Document;
  media?: {
    url: string;
    title: string;
    width: number;
    height: number;
    contentType: string;
  }[];
  audio?: {
    url: string;
    title: string;
    contentType: string;
  };
  publishedAt: string;
  tags: string[];
}

// Helper function to format Contentful asset URLs with optimization parameters
export const getOptimizedImageUrl = (imageUrl: string, {
  width = 800,
  height,
  quality = 80,
  format = 'webp',
  fit = 'fill'
}: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
  fit?: 'fill' | 'scale' | 'crop';
} = {}) => {
  if (!imageUrl) return '';

  // Remove any existing query parameters
  const baseUrl = imageUrl.split('?')[0];

  // Build query parameters
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  params.set('fm', format); // Contentful uses 'fm' instead of 'f' for format
  params.set('fit', fit);

  // Debug log
  const finalUrl = `${baseUrl}?${params.toString()}`;
  console.log('Generated image URL:', {
    original: imageUrl,
    optimized: finalUrl
  });

  return finalUrl;
};

// Initialize Contentful client
export const contentfulClient = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ?? '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ?? '',
});

// Helper function to create URL-friendly slugs
const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    // Replace Turkish characters with their ASCII equivalents
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9\-]/g, '-')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '');
};

// Add type definitions for ContentfulEntry and ContentfulAsset
interface ContentfulAsset {
  fields?: {
    file?: {
      url: string;
      details: {
        image?: {
          width: number;
          height: number;
        };
        size?: number;
      };
      contentType: string;
    };
    title?: string;
    description?: string;
  };
  sys?: {
    id: string;
  };
}

interface ContentfulEntry {
  fields: {
    title?: string;
    slug?: string;
    description?: string;
    body?: Document;
    media?: ContentfulAsset[];
    audio?: ContentfulAsset;
    tags?: string[];
  };
  sys?: {
    id?: string;
    createdAt?: string;
    contentType?: {
      sys?: {
        id?: string;
      };
    };
  };
}

// Helper function to transform Contentful response to our BlogPost type
export const transformContentfulBlogPost = (entry: ContentfulEntry): BlogPost => {
  if (!entry?.fields) {
    console.error('Invalid entry structure:', entry);
    throw new Error('Invalid Contentful entry structure');
  }

  const fields = entry.fields;
  
  // Debug log
  console.log('Processing Contentful Entry:', {
    id: entry.sys?.id,
    contentType: entry.sys?.contentType?.sys?.id,
    fields: Object.keys(fields),
    tags: fields.tags,
  });
  
  // Handle media assets
  const mediaAssets = Array.isArray(fields.media) ? fields.media : [];
  const processedMedia = mediaAssets.map((media: ContentfulAsset) => {
    if (!media?.fields?.file) {
      console.error('Invalid media structure:', media);
      return null;
    }

    const file = media.fields.file;

    // Ensure URL has https protocol and remove any existing query parameters
    let imageUrl = file.url;
    if (imageUrl.startsWith('//')) {
      imageUrl = `https:${imageUrl}`;
    }
    imageUrl = imageUrl.split('?')[0];

    return {
      url: imageUrl,
      title: media.fields.title || '',
      width: file.details?.image?.width || 0,
      height: file.details?.image?.height || 0,
      contentType: file.contentType,
    };
  }).filter(Boolean) as BlogPost['media'];

  // Handle audio asset
  let audioAsset: BlogPost['audio'] = undefined;
  if (fields.audio?.fields?.file) {
    const audioFile = fields.audio.fields.file;
    audioAsset = {
      url: audioFile.url.startsWith('//') ? `https:${audioFile.url}` : audioFile.url,
      title: fields.audio.fields.title || '',
      contentType: audioFile.contentType,
    };
  }

  // Use the slug field if available, otherwise generate from title
  const slug = fields.slug || createSlug(fields.title || 'untitled');

  return {
    title: fields.title || 'Untitled',
    slug,
    description: fields.description || '',
    body: fields.body || { nodeType: BLOCKS.DOCUMENT, data: {}, content: [] },
    media: processedMedia,
    audio: audioAsset,
    publishedAt: entry.sys?.createdAt || new Date().toISOString(),
    tags: (fields.tags || []).map(tag => tag.trim()), // Clean up tags
  };
};

// Fetch blog posts with pagination
export async function getBlogPosts(options: {
  limit?: number;
  skip?: number;
  tag?: string;
  featured?: boolean;
} = {}) {
  const { limit = 6, skip = 0, tag, featured } = options;
  
  console.log("getBlogPosts called with tag:", tag, "type:", typeof tag);
  
  const query: Record<string, unknown> = {
    content_type: 'blogPost',
    limit,
    skip,
    order: '-sys.createdAt',
    include: 2,
  };

  if (tag) {
    // Match exact tag (case-insensitive)
    console.log("Adding tag to query:", tag);
    query['fields.tags[in]'] = tag;
  }

  if (featured) {
    query['fields.tags[in]'] = 'Featured';
  }

  try {
    console.log("Sending query to Contentful:", JSON.stringify(query));
    const response = await contentfulClient.getEntries(query);
    console.log('Fetched entries:', {
      total: response.total,
      items: response.items.length,
      query: query,
    });
    
    const posts = response.items.map(transformContentfulBlogPost);
    
    // Log the first few posts' tags to debug
    if (posts.length > 0) {
      console.log('First few posts tags:', posts.slice(0, 3).map(post => post.tags));
    } else {
      console.log('No posts found for the query');
    }
    
    return {
      posts,
      total: response.total,
      skip: response.skip,
      limit: response.limit,
    };
  } catch (error) {
    console.error('Error fetching posts from Contentful:', error);
    return {
      posts: [],
      total: 0,
      skip: 0,
      limit,
    };
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  try {
    console.log('Fetching post with slug:', slug);
    
    // Try to find by exact slug field first
    let response = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
      include: 2,
    });

    // If not found, try to find by title (converted to slug)
    if (!response.items.length) {
      console.log('No post found with exact slug, trying title match...');
      response = await contentfulClient.getEntries({
        content_type: 'blogPost',
        limit: 1,
        include: 2,
      });

      // Filter items where the title converts to the requested slug
      response.items = response.items.filter(item => {
        const title = item.fields?.title;
        return typeof title === 'string' && createSlug(title) === slug;
      });
    }

    console.log('Contentful response:', {
      total: response.total,
      items: response.items.length,
      matchedSlug: response.items[0]?.fields?.slug,
      matchedTitle: response.items[0]?.fields?.title,
    });

    if (!response.items.length) {
      console.log('No post found with slug:', slug);
      return null;
    }

    return transformContentfulBlogPost(response.items[0]);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw error;
  }
}

// Fetch all available tags
export async function getAllTags() {
  try {
    const response = await contentfulClient.getTags();
    return response.items.map(tag => ({
      id: tag.sys.id,
      name: tag.name,
    }));
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
} 