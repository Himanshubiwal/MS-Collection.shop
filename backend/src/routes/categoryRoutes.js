import express from 'express';

const router = express.Router();

// @desc    Get MS Collection categories and lookbook highlights
// @route   GET /api/categories
// @access  Public
router.get('/', (req, res) => {
  const categories = [
    {
      name: 'All',
      slug: 'all',
      description: 'Explore the complete MS Collection catalog.',
    },
    {
      name: 'Tops',
      slug: 'tops',
      description: 'Luxury shirts, heavyweight cotton tees, longsleeves, and premium crewnecks.',
    },
    {
      name: 'Bottoms',
      slug: 'bottoms',
      description: 'Tailored trousers, relaxed shorts, and comfortable essentials.',
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Crafted leather goods, caps, and lifestyle essentials.',
    },
    {
      name: 'Outerwear',
      slug: 'outerwear',
      description: 'Jackets, hoodies and crewnecks crafted for Rajasthani winters and crisp evenings.',
    },
  ];

  res.json({
    success: true,
    categories,
  });
});

// @desc    Get MS Collection lookbook stories and features
// @route   GET /api/lookbook
// @access  Public
router.get('/stories', (req, res) => {
  const lookbookStories = [
    {
      title: 'Review our shipping and returns information',
      subtitle: 'Customer Care & Dispatch',
      imageUrl: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80',
      linkText: 'Shipping & Returns',
      linkUrl: '/about#shipping',
    },
    {
      title: 'Email our team for all inquiries',
      subtitle: 'Direct Support',
      imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
      linkText: 'Contact Us',
      linkUrl: '/about#contact',
    },
    {
      title: 'Explore the Spring–Summer 26 Lookbook',
      subtitle: 'Lightness & Movement',
      imageUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=800&q=80',
      linkText: 'Discover Lookbook',
      linkUrl: '/lookbook',
    },
    {
      title: 'Discover our selected features and mentions',
      subtitle: 'Press & Editorial',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      linkText: 'The Pacesetters Feature',
      linkUrl: '/about#press',
    },
  ];

  res.json({
    success: true,
    stories: lookbookStories,
  });
});

export default router;
