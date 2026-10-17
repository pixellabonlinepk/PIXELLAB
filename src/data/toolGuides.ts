import { ToolGuideContent } from '../types';

export const TOOL_GUIDES: Record<string, ToolGuideContent> = {
  'image-compressor': {
    steps: [
      { step: 1, title: 'Upload Your Image', desc: 'Drag and drop or select any JPG, PNG, or WebP file from your computer or phone.' },
      { step: 2, title: 'Choose Target Quality', desc: 'Select a quick preset (e.g. WhatsApp, Web Quality) or fine-tune the compression slider.' },
      { step: 3, title: 'Instant Download', desc: 'Inspect the live file size savings and download your optimized image with zero watermarks.' },
    ],
    howItWorks:
      'Pixal Lab Image Compressor processes your photos directly inside your web browser using HTML5 Canvas and browser-native image codecs. Unlike legacy compression websites that upload your personal photos to remote cloud servers, our in-browser engine adjusts quantization matrices, chroma subsampling, and entropy encoding entirely on your device CPU. This guarantees that your private images, sensitive documents, and personal memories never leave your browser, providing 100% data security, infinite bandwidth, and zero waiting in server queues.',
    benefits: [
      'Reduces file sizes by up to 90% while preserving crisp sharpness and vibrant colors',
      '100% private client-side processing with zero server uploads or cloud storage',
      'One-click quick presets tailored for WhatsApp, email attachments, and web optimization',
      'Real-time before-and-after interactive slider to verify pixel quality before downloading',
    ],
    faqs: [
      {
        question: 'Will compressing my image reduce its visual quality or dimensions?',
        answer: 'Our smart compression algorithm optimizes metadata, color palettes, and compression tables while keeping pixel dimensions intact. You can preview the output live to ensure zero noticeable blurriness.',
      },
      {
        question: 'Are my personal images uploaded to any server or database?',
        answer: 'Never. Pixal Lab runs 100% client-side in your browser using HTML5 Canvas. We have no backend file servers, and your images are never stored, logged, or viewed by anyone.',
      },
      {
        question: 'What image formats can I compress with this tool?',
        answer: 'You can compress JPG/JPEG, PNG, WebP, and standard image formats up to 50 MB per file with instant real-time results.',
      },
      {
        question: 'Is there any limit on how many images I can compress?',
        answer: 'No limits at all. Pixal Lab is completely free with no registration, no subscriptions, and unlimited daily usage for creators, students, and professionals.',
      },
      {
        question: 'Why is image compression important for websites and SEO?',
        answer: 'Compressed images load up to 5x faster, drastically boosting Google PageSpeed Insights scores, reducing mobile data consumption, and improving Google Core Web Vitals for higher organic search rankings.',
      },
    ],
  },

  'image-resizer': {
    steps: [
      { step: 1, title: 'Choose Photo to Resize', desc: 'Select or drop your image into the workspace canvas.' },
      { step: 2, title: 'Specify Dimensions', desc: 'Enter exact pixel width and height, or click popular presets like Full HD, Instagram, or WhatsApp.' },
      { step: 3, title: 'Download Resized Image', desc: 'Save the resized image instantly in high definition with locked or unlocked aspect ratio.' },
    ],
    howItWorks:
      'The Pixal Lab Image Resizer utilizes high-quality bicubic and bilinear interpolation algorithms within the HTML5 Canvas 2D rendering context. When you scale an image down or up, the browser recalculates sub-pixel coordinates to prevent pixelation, jagged edges, or stretching. By locking the aspect ratio, the tool automatically calculates proportional height when width changes, ensuring your subjects never look distorted.',
    benefits: [
      'Precise pixel dimension control with proportional aspect ratio lock/unlock',
      'Instant presets for YouTube, Instagram, Facebook, LinkedIn, and Full HD screens',
      'No quality degradation or blurriness thanks to smooth sub-pixel interpolation',
      'Completely free with zero account requirements, watermarks, or usage quotas',
    ],
    faqs: [
      {
        question: 'How do I keep my image from looking stretched or squished?',
        answer: 'Keep the "Lock Aspect Ratio" toggle enabled. When you type in a new width, the height will automatically calculate to match your image original proportions.',
      },
      {
        question: 'Can I enlarge a low-resolution photo without making it blurry?',
        answer: 'You can increase dimensions, but scaling up an image beyond its native resolution creates new pixels via interpolation. For sharpest results, resize down from high-resolution originals.',
      },
      {
        question: 'Can I resize photos for social media profile pictures and banners?',
        answer: 'Yes! Quick presets for 1080x1080 (Instagram), 1920x1080 (Full HD), 1200x630 (Web/Facebook), and 500x500 (WhatsApp DP) are built right in.',
      },
      {
        question: 'Does this tool work on mobile devices and tablets?',
        answer: 'Yes, Pixal Lab is fully responsive and touch-optimized for iPhones, Android smartphones, iPads, and desktop computers.',
      },
    ],
  },

  'batch-image-resizer': {
    steps: [
      { step: 1, title: 'Upload Multiple Images', desc: 'Select dozens of images at once using our multi-file selector.' },
      { step: 2, title: 'Set Batch Dimensions', desc: 'Apply target width and height or percentage scale to all files simultaneously.' },
      { step: 3, title: 'Download ZIP Archive', desc: 'Download all processed photos cleanly bundled into a single ZIP file.' },
    ],
    howItWorks:
      'Batch processing in Pixal Lab harnesses client-side JavaScript asynchronous queues and the JSZip library. Each file is loaded into an isolated canvas buffer, transformed to your target dimensions, encoded, and packaged into a ZIP archive without requiring heavy server uploads or software installations.',
    benefits: [
      'Resize dozens of product photos or gallery collections simultaneously in seconds',
      'Convenient one-click ZIP archive packaging for rapid workflow',
      'Aspect ratio preservation across photos of diverse shapes and sizes',
      'Runs locally on your device for absolute confidentiality and lightning speed',
    ],
    faqs: [
      {
        question: 'How many photos can I batch resize at one time?',
        answer: 'You can process 20 to 50 photos simultaneously depending on your device memory and processing power.',
      },
      {
        question: 'How do I open the downloaded ZIP file?',
        answer: 'All modern operating systems (Windows, macOS, iOS, Android) can open ZIP files natively by double-clicking or tapping Extract.',
      },
      {
        question: 'Are my original files overwritten?',
        answer: 'No, your original images remain completely safe and untouched on your device. Only new resized copies are packaged into the download.',
      },
    ],
  },

  'image-cropper': {
    steps: [
      { step: 1, title: 'Load Image', desc: 'Upload your photo into the interactive cropping canvas.' },
      { step: 2, title: 'Adjust Crop Area', desc: 'Drag the handles or select fixed aspect ratios (1:1, 16:9, 4:3, 9:16).' },
      { step: 3, title: 'Export Cropped Photo', desc: 'Crop out unwanted margins and save your focused composition immediately.' },
    ],
    howItWorks:
      'Pixal Lab Image Cropper provides an intuitive bounding box on top of the image coordinates. Once you define the rectangular boundary, the canvas extracts the precise pixel coordinates using drawImage slicing, producing a clean, lossless cut of the selected zone.',
    benefits: [
      'Freeform rectangular cropping and locked aspect ratios for social stories and avatars',
      'Visual guide boundaries with live dimension feedback',
      'Zero loss in pixel sharpness inside the cropped region',
      'Instant client-side export in PNG or JPEG format',
    ],
    faqs: [
      {
        question: 'What aspect ratio is best for Instagram and profile pictures?',
        answer: 'A 1:1 square ratio is recommended for profile avatars and standard Instagram posts, while 9:16 is ideal for TikTok, Instagram Reels, and YouTube Shorts.',
      },
      {
        question: 'Can I crop high-resolution DSLR photos?',
        answer: 'Yes, Pixal Lab easily processes high-resolution photos up to 50 MB directly on your device.',
      },
      {
        question: 'Is cropping destructive to my original photo?',
        answer: 'No, your original file is never modified; a newly cropped image is generated for download.',
      },
    ],
  },

  'photo-collage-dp-maker': {
    steps: [
      { step: 1, title: 'Select Template & Photos', desc: 'Choose a circular squad DP, grid collage, or artistic multi-frame layout.' },
      { step: 2, title: 'Personalize & Style', desc: 'Add friends photos, customize glow borders, stickers, gradients, and custom text.' },
      { step: 3, title: 'Export High-Res DP', desc: 'Download your 1:1 circular group DP or collage ready for WhatsApp and Instagram.' },
    ],
    howItWorks:
      'The Photo Collage & DP Maker is a full-featured creative graphics suite in your browser. It features multiple layer rendering, canvas clipping masks, customizable cutouts (circle, heart, hexagon, shield, star), border glow effects, dynamic typography, and safe-circle overlays designed specifically for WhatsApp and social media avatars.',
    benefits: [
      'Turn multiple individual portrait photos into a stunning unified group profile picture',
      'Safe circle overlay ensures avatars never get clipped by WhatsApp or Instagram circles',
      'Rich creative elements: stickers, badges, decorative shapes, typography, and background gradients',
      'Full Undo/Redo history, layer re-ordering, and zoom controls for professional design',
    ],
    faqs: [
      {
        question: 'What is a Group DP and why is it popular?',
        answer: 'A Group DP brings photos of friends, family members, or team colleagues together into one unified circular avatar, ideal for WhatsApp group icons and community profiles.',
      },
      {
        question: 'How does the Safe Circle guide help my avatar?',
        answer: 'Social apps like WhatsApp and Instagram crop square avatars into circles. The Safe Circle guide shows you exactly where the border cuts so faces and text are never cut off.',
      },
      {
        question: 'Can I customize individual photo positions inside the collage?',
        answer: 'Yes, you can click any slot to swap photos, adjust border widths, change shapes, and apply individual filters.',
      },
    ],
  },

  'passport-photo-resizer': {
    steps: [
      { step: 1, title: 'Upload Portrait Photo', desc: 'Select a clean, front-facing portrait photo with good lighting.' },
      { step: 2, title: 'Choose Country Standard', desc: 'Select Pakistan Passport & CNIC, US 2x2", UK 35x45mm, or Schengen.' },
      { step: 3, title: 'Export at 300 DPI', desc: 'Download your official biometric passport photo formatted for printing or online submission.' },
    ],
    howItWorks:
      'Official visa and passport agencies require precise millimeter dimensions and 300 DPI (dots per inch) print resolution. The Pixal Lab Passport Photo Resizer scales your photo to exact biometric specifications with centered head composition and clean white background rendering.',
    benefits: [
      'Supports official standards for Pakistan (Passport & CNIC), US, UK, Schengen, and India',
      'Accurate 300 DPI high-resolution export compliant with government online visa portals',
      'Automatic white/neutral background normalization for passport criteria',
      'Complete privacy: biometric facial photos are processed 100% locally on your computer or phone',
    ],
    faqs: [
      {
        question: 'What are the official dimensions for Pakistan Passport and CNIC photos?',
        answer: 'The official requirement for Pakistani passports and NADRA CNIC cards is 35mm x 45mm (413 x 531 pixels at 300 DPI) with a plain white or light blue background.',
      },
      {
        question: 'What is the required size for US Visa and Green Card photos?',
        answer: 'US Passports and Visas require a square 2x2 inch photo (51x51 mm or 600x600 pixels at 300 DPI) with a white background.',
      },
      {
        question: 'Can I print these photos at a local print shop or studio?',
        answer: 'Yes! The downloaded images are calibrated to 300 DPI print quality and can be printed on standard photographic paper at any studio or home photo printer.',
      },
    ],
  },

  'qr-code-generator': {
    steps: [
      { step: 1, title: 'Enter Text or URL', desc: 'Type or paste your website URL, contact info, text, or social link.' },
      { step: 2, title: 'Customize Appearance', desc: 'Pick custom foreground and background colors and adjust margin size.' },
      { step: 3, title: 'Download Scannable QR', desc: 'Save as a sharp, high-resolution PNG image ready for print or web.' },
    ],
    howItWorks:
      'Pixal Lab QR Code Generator encodes alphanumeric data into standard 2D matrix symbology using Reed-Solomon error correction algorithms. This ensures your QR codes scan instantly on any iPhone, Android, or barcode scanner even if partially obscured or printed on textured paper.',
    benefits: [
      'Genuinely scannable QR codes with Level H error correction for maximum durability',
      'Custom colors, dark mode styling, and high-DPI rasterization',
      'No expiration dates: generated QR codes are static and permanent forever',
      'Ideal for business cards, restaurant menus, flyers, and promotional merchandise',
    ],
    faqs: [
      {
        question: 'Do these QR codes ever expire or require a monthly subscription?',
        answer: 'No! Pixal Lab generates permanent, static QR codes that contain your actual URL or text directly inside the pattern. They will work forever without subscriptions or redirects.',
      },
      {
        question: 'What phone cameras can scan these QR codes?',
        answer: 'All modern iOS and Android camera apps, Google Lens, and QR reader apps can scan them immediately.',
      },
      {
        question: 'Can I use custom brand colors for my QR code?',
        answer: 'Yes, you can pick any foreground and background color. Make sure to keep good contrast so scanners can read it easily.',
      },
    ],
  },
};

export function getToolGuide(toolId: string, toolName: string, categoryLabel: string): ToolGuideContent {
  if (TOOL_GUIDES[toolId]) {
    return TOOL_GUIDES[toolId];
  }

  // High-value fallback generated dynamically for any other tool
  return {
    steps: [
      { step: 1, title: `Upload to ${toolName}`, desc: 'Select or drop your image into the interactive editor workspace.' },
      { step: 2, title: 'Adjust Parameters', desc: `Fine-tune your preferred ${toolName.toLowerCase()} settings using real-time visual controls.` },
      { step: 3, title: 'Instant Download', desc: 'Save your polished image in crystal-clear quality with zero uploads or watermarks.' },
    ],
    howItWorks:
      `Pixal Lab ${toolName} operates entirely inside your web browser utilizing modern HTML5 Canvas, WebGL, and Web API graphics technology. Unlike traditional cloud converter services that transmit your private images across public networks to remote servers, our client-side engine executes all mathematical image transformations locally on your device CPU. This architectural advantage ensures total personal privacy, zero upload waiting times, and unrestricted usage without data collection.`,
    benefits: [
      `100% private, in-browser ${toolName.toLowerCase()} processing with zero cloud uploads`,
      'Live before-and-after comparison tools to evaluate results in real time',
      'Instant high-resolution downloads with no watermarks, account requirements, or fees',
      `Optimized for desktop computers, laptops, iPads, tablets, and smartphones`,
    ],
    faqs: [
      {
        question: `How does ${toolName} protect my privacy?`,
        answer: `All computations run strictly within your browser memory. Your files are never uploaded to any server, stored in databases, or seen by third parties.`,
      },
      {
        question: `Is ${toolName} free to use?`,
        answer: `Yes, all tools on Pixal Lab are 100% free with unlimited daily usage, no account signup required, and zero hidden costs.`,
      },
      {
        question: `What formats are supported by ${toolName}?`,
        answer: `Most common formats including JPG, PNG, WebP, and standard image formats are supported with instantaneous conversion.`,
      },
      {
        question: `Can I use ${toolName} on my phone?`,
        answer: `Yes, Pixal Lab is built with a responsive interface that functions smoothly on Android and iOS mobile devices.`,
      },
    ],
  };
}
