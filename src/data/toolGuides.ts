import { ToolGuideContent } from '../types';

export const TOOL_GUIDES: Record<string, ToolGuideContent> = {
  'image-compressor': {
    steps: [
      { step: 1, title: 'Upload Your Image', desc: 'Drag and drop or select any JPG, PNG, or WebP file from your computer or phone.' },
      { step: 2, title: 'Choose Target Quality', desc: 'Select a quick preset (e.g. WhatsApp, Web Quality) or fine-tune the compression slider.' },
      { step: 3, title: 'Instant Download', desc: 'Inspect the live file size savings and download your optimized image with zero watermarks.' },
    ],
    howItWorks:
      'PIXAL LAB Image Compressor processes your photos directly inside your web browser using HTML5 Canvas and browser-native image codecs. Unlike legacy compression websites that upload your personal photos to remote cloud servers, our in-browser engine adjusts quantization matrices, chroma subsampling, and entropy encoding entirely on your device CPU. This guarantees that your private images, sensitive documents, and personal memories never leave your browser, providing 100% data security, infinite bandwidth, and zero waiting in server queues.',
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
        answer: 'Never. PIXAL LAB runs 100% client-side in your browser using HTML5 Canvas. We have no backend file servers, and your images are never stored, logged, or viewed by anyone.',
      },
      {
        question: 'What image formats can I compress with this tool?',
        answer: 'You can compress JPG/JPEG, PNG, WebP, and standard image formats up to 50 MB per file with instant real-time results.',
      },
      {
        question: 'Is there any limit on how many images I can compress?',
        answer: 'No limits at all. PIXAL LAB is completely free with no registration, no subscriptions, and unlimited daily usage for creators, students, and professionals.',
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
      'The PIXAL LAB Image Resizer utilizes high-quality bicubic and bilinear interpolation algorithms within the HTML5 Canvas 2D rendering context. When you scale an image down or up, the browser recalculates sub-pixel coordinates to prevent pixelation, jagged edges, or stretching. By locking the aspect ratio, the tool automatically calculates proportional height when width changes, ensuring your subjects never look distorted.',
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
        answer: 'Yes, PIXAL LAB is fully responsive and touch-optimized for iPhones, Android smartphones, iPads, and desktop computers.',
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
      'Batch processing in PIXAL LAB harnesses client-side JavaScript asynchronous queues and the JSZip library. Each file is loaded into an isolated canvas buffer, transformed to your target dimensions, encoded, and packaged into a ZIP archive without requiring heavy server uploads or software installations.',
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
      'PIXAL LAB Image Cropper provides an intuitive bounding box on top of the image coordinates. Once you define the rectangular boundary, the canvas extracts the precise pixel coordinates using drawImage slicing, producing a clean, lossless cut of the selected zone.',
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
        answer: 'Yes, PIXAL LAB easily processes high-resolution photos up to 50 MB directly on your device.',
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
      'Official visa and passport agencies require precise millimeter dimensions and 300 DPI (dots per inch) print resolution. The PIXAL LAB Passport Photo Resizer scales your photo to exact biometric specifications with centered head composition and clean white background rendering.',
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
      'PIXAL LAB QR Code Generator encodes alphanumeric data into standard 2D matrix symbology using Reed-Solomon error correction algorithms. This ensures your QR codes scan instantly on any iPhone, Android, or barcode scanner even if partially obscured or printed on textured paper.',
    benefits: [
      'Genuinely scannable QR codes with Level H error correction for maximum durability',
      'Custom colors, dark mode styling, and high-DPI rasterization',
      'No expiration dates: generated QR codes are static and permanent forever',
      'Ideal for business cards, restaurant menus, flyers, and promotional merchandise',
    ],
    faqs: [
      {
        question: 'Do these QR codes ever expire or require a monthly subscription?',
        answer: 'No! PIXAL LAB generates permanent, static QR codes that contain your actual URL or text directly inside the pattern. They will work forever without subscriptions or redirects.',
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

  'signature-maker': {
    steps: [
      { step: 1, title: 'Draw Signature', desc: 'Use mouse, trackpad, stylus, or touch screen to draw your signature smoothly.' },
      { step: 2, title: 'Customize Stroke & Color', desc: 'Adjust pen width, select ink colors (black, blue, white), or switch to eraser mode.' },
      { step: 3, title: 'Download PNG / SVG', desc: 'Export as transparent PNG for PDF contracts or copy straight to clipboard.' },
    ],
    howItWorks:
      'PIXAL LAB Digital Signature Maker captures high-precision vector touch coordinates and draws smooth quadratic Bezier curves on an HTML5 Canvas. The generated signature is rendered directly on your local device without sending strokes across the network, providing 100% security for legal agreements and document signings.',
    benefits: [
      'Smooth Bezier stroke interpolation prevents pixelation and jagged handwriting',
      'Transparent PNG and scalable SVG vector download options',
      '100% private: signature data never leaves your device memory',
      'One-click direct copy to clipboard for rapid contract pasting',
    ],
    faqs: [
      {
        question: 'Is my digital signature legally valid?',
        answer: 'Yes, electronic and digital signatures are accepted on most standard agreements, commercial contracts, and NDAs under the US ESIGN Act and international e-signature laws.',
      },
      {
        question: 'Are my signatures saved on any server?',
        answer: 'No. Everything is drawn and exported entirely inside your local browser memory. Zero signatures are stored, logged, or uploaded.',
      },
      {
        question: 'Can I draw with an Apple Pencil or stylus pen?',
        answer: 'Yes! The canvas is fully touch and stylus-enabled on iPad, Android tablets, and touchscreen laptops.',
      },
    ],
  },

  'image-splitter': {
    steps: [
      { step: 1, title: 'Upload Photo', desc: 'Select any wide photo, panorama, or square image.' },
      { step: 2, title: 'Pick Grid Preset', desc: 'Select 3x1 carousel, 3x2, or 3x3 Instagram feed grid layout.' },
      { step: 3, title: 'Download ZIP Tiles', desc: 'Download all slices packaged into a ZIP file with numbered ordering.' },
    ],
    howItWorks:
      'The Image Splitter slices the source canvas into exact mathematical columns and rows using client-side sub-pixel coordinate bounding boxes. Each tile is encoded into high-resolution PNG or JPG format and bundled into a ZIP file using the JSZip library.',
    benefits: [
      'Create viral 3x3 puzzle feeds and seamless multi-slide panoramic carousels',
      'Pre-configured presets for Instagram feeds, carousels, and stories',
      'Numbered tile naming for effortless sequential uploading',
      'Lossless client-side image slicing with zero server uploads',
    ],
    faqs: [
      {
        question: 'How do I upload the split images to Instagram in order?',
        answer: 'Upload tile 1 to tile 9 in reverse or sequential order as labeled on the downloaded files so the profile feed matches perfectly.',
      },
      {
        question: 'Will splitting reduce image resolution?',
        answer: 'No, each tile is cropped directly from original high-resolution pixels without downsampling.',
      },
    ],
  },

  'brightness-contrast-tool': {
    steps: [
      { step: 1, title: 'Upload Photo', desc: 'Drop any underexposed, dark, or washed-out photo into the editor.' },
      { step: 2, title: 'Fine-Tune Sliders', desc: 'Adjust Brightness, dynamic Contrast, and Convolution Sharpening.' },
      { step: 3, title: 'Instant Export', desc: 'Inspect split before/after view and download the enhanced high-def image.' },
    ],
    howItWorks:
      'This studio processes raw pixel RGBA buffers via HTML5 Canvas ImageData. It applies mathematical contrast normalization curves, exposure gain adjustments, and 3x3 unsharp convolution matrices locally on your device CPU for instantaneous, artifact-free photo retouching.',
    benefits: [
      'Rescues dark, poorly lit, or hazy photos in seconds',
      'Convolution sharpening brings out crisp texture and fine facial details',
      'Real-time before-and-after split preview slider',
      '100% private: photos remain strictly within browser memory',
    ],
    faqs: [
      {
        question: 'Does increasing contrast wash out skin tones?',
        answer: 'Our algorithm applies balanced tonal scaling to preserve highlights and shadows without harsh clipping.',
      },
      {
        question: 'What does the sharpen slider do?',
        answer: 'It applies a 3x3 unsharp mask kernel to edges in the image, making soft or slightly blurry photos look much crisper.',
      },
    ],
  },

  'aspect-ratio-pad': {
    steps: [
      { step: 1, title: 'Upload Any Photo', desc: 'Select or drop any landscape, portrait, or square image.' },
      { step: 2, title: 'Choose Target Ratio & Fill', desc: 'Select 1:1, 4:5, 9:16 or 16:9 and pick an aesthetic blurred or solid color background.' },
      { step: 3, title: 'Download Social-Ready Image', desc: 'Export your photo perfectly formatted for Instagram, TikTok, or YouTube without losing parts of your photo to cropping.' },
    ],
    howItWorks:
      'The No-Crop Social Expander calculates optimal canvas geometry based on standard social aspect ratios (1:1 square for Instagram posts, 4:5 vertical for feed engagement, 9:16 for TikTok/Reels/Stories, and 16:9 for YouTube). Instead of destructively cropping out people or scenery, it cushions the photo with an atmospheric Gaussian-blurred mirrored replica or clean solid color border.',
    benefits: [
      'Fit full portraits into Instagram square or vertical feeds with zero cropping',
      'Aesthetic cinematic blurred background fill with soft drop shadow depth',
      'Solid white, pitch-black OLED, or custom brand color borders',
      '100% private in-browser generation with high-fidelity PNG export',
    ],
    faqs: [
      {
        question: 'Why should I pad an image instead of cropping it?',
        answer: 'Cropping frequently cuts off heads, group members, or important composition elements. Padding preserves every single pixel of your original photo while fitting social platform frame constraints.',
      },
      {
        question: 'Which aspect ratio is best for Instagram posts and stories?',
        answer: 'Use 1:1 for classic square posts, 4:5 for maximum mobile vertical feed real estate, and 9:16 for Instagram Stories and Reels.',
      },
      {
        question: 'Does the blurred background cause pixelation?',
        answer: 'No. The background utilizes a multi-pass Gaussian blur filter and slight scale magnification to create a smooth, luxurious aesthetic glow.',
      },
    ],
  },

  'exif-metadata-remover': {
    steps: [
      { step: 1, title: 'Select Photo to Clean', desc: 'Select any JPEG, PNG, or camera photo containing sensitive metadata.' },
      { step: 2, title: 'Inspect & Scrub Metadata', desc: 'Review detected EXIF tags, GPS geotags, and device information.' },
      { step: 3, title: 'Download Verified Clean Photo', desc: 'Save your sanitized photo with 100% of camera, GPS, and timestamp metadata stripped.' },
    ],
    howItWorks:
      'Modern digital cameras and smartphones embed rich Exchangeable Image File (EXIF) metadata into photo headers: exact GPS latitude/longitude coordinates, device serial numbers, camera model, lens settings, and exact timestamps. PIXAL LAB cleans this metadata by rendering the raw pixel bitmap to an isolated HTML5 Canvas buffer and re-encoding it into a clean stream. This mathematical extraction discards every binary header tag while leaving image visual quality completely untouched.',
    benefits: [
      'Permanently purges GPS coordinates, home locations, and geolocation data',
      'Removes camera serial numbers, iPhone/Android device IDs, and shutter timestamps',
      'Re-encodes cleanly with high-grade JPEG/PNG codecs with zero visible quality loss',
      '100% client-side: unscrubbed photos are NEVER sent across the internet to a server',
    ],
    faqs: [
      {
        question: 'Why is stripping EXIF metadata critical for online privacy?',
        answer: 'Photos taken on smartphones contain your exact home or work GPS coordinates. Anyone downloading the photo can view where and when it was captured. Cleaning metadata protects your identity and personal safety.',
      },
      {
        question: 'Does removing EXIF reduce photo resolution or visual sharpness?',
        answer: 'No. Pixel dimensions and visual data remain exactly the same. Only invisible binary metadata headers (camera name, GPS, lens) are permanently discarded.',
      },
      {
        question: 'Is this tool safe for sensitive government or legal documents?',
        answer: 'Yes. PIXAL LAB runs 100% client-side in your local browser memory. Files are never transmitted to any third party or cloud database.',
      },
    ],
  },

  'image-format-converter': {
    steps: [
      { step: 1, title: 'Upload Image File', desc: 'Select or drag any PNG, JPG, WebP, BMP, or SVG graphic into the converter.' },
      { step: 2, title: 'Select Target Format', desc: 'Choose PNG (lossless with alpha transparency), JPG (standard compressed), or modern WebP.' },
      { step: 3, title: 'Instant Conversion', desc: 'Download your converted image immediately with zero server delays or quality degradation.' },
    ],
    howItWorks:
      'The PIXAL LAB Image Format Converter utilizes browser-native HTML5 Canvas rasterization engines and native codecs (image/png, image/jpeg, image/webp). When transforming formats, the browser parses the source bitmap into an uncompressed 32-bit RGBA buffer and re-encodes it into your chosen output specification. Transparent alpha channels are preserved in PNG and WebP conversions, while JPG conversions seamlessly normalize transparent pixels onto a pure white canvas.',
    benefits: [
      'Convert between WebP, PNG, and JPG in milliseconds without server queues',
      'Alpha transparency preservation for icons, logos, and UI graphics',
      '100% private in-browser conversion: your files never leave your device',
      'High-efficiency WebP compression reduces website bandwidth by up to 35%',
    ],
    faqs: [
      {
        question: 'Can I convert WebP images back into standard JPG or PNG format?',
        answer: 'Yes! Simply upload your WebP image, select JPG or PNG as the target format, and click download. It converts instantly for compatibility with legacy software and older picture viewers.',
      },
      {
        question: 'What happens to transparent backgrounds when converting PNG to JPG?',
        answer: 'Because the JPEG format does not support alpha transparency channels, transparent areas are automatically normalized to a crisp, clean white background.',
      },
      {
        question: 'Is there any file upload limit or daily conversion quota?',
        answer: 'No quotas at all. You can convert files up to 40 MB each with unlimited daily conversions completely free without creating an account.',
      },
    ],
  },

  'image-to-pdf-converter': {
    steps: [
      { step: 1, title: 'Select Image(s)', desc: 'Choose one or multiple photos, scanned receipts, or document pages from your device.' },
      { step: 2, title: 'Configure Page Layout', desc: 'Select A4 or US Letter page size, Portrait or Landscape orientation, and margin spacing.' },
      { step: 3, title: 'Generate PDF Document', desc: 'Download a clean, multi-page vector-wrapped PDF ready for printing, submission, or emailing.' },
    ],
    howItWorks:
      'PIXAL LAB Image to PDF Converter compiles images into standardized Adobe PDF document specifications directly in client-side memory using the jsPDF library. Each uploaded image is scaled proportionally to fit standard print page margins without geometric stretching or compression artifacts. Multi-image workflows sequentially paginate each photo onto its own dedicated page, producing an optimized, compact PDF document in seconds.',
    benefits: [
      'Combine multiple photos, forms, and receipts into a single organized PDF',
      'Standard A4 and US Letter document standards with Portrait and Landscape options',
      '100% confidential: sensitive financial receipts and IDs are never sent to remote cloud servers',
      'Proportional scaling preserves original sharpness for crystal-clear physical printing',
    ],
    faqs: [
      {
        question: 'How many images can I combine into a single PDF document?',
        answer: 'You can combine dozens of images into a single PDF file. The browser handles the layout in memory, allowing you to create comprehensive multi-page documents.',
      },
      {
        question: 'Will my scanned documents and receipts remain sharp when printed?',
        answer: 'Yes! The converter embeds images at high resolution, matching your source image quality so text and fine numbers remain legible when printed or viewed on high-DPI displays.',
      },
      {
        question: 'Is it safe to convert bank statements and identity documents here?',
        answer: 'Completely safe. Unlike cloud PDF services that upload your personal records to third-party servers, PIXAL LAB processes your PDF 100% locally on your computer or phone.',
      },
    ],
  },

  'pdf-to-image-converter': {
    steps: [
      { step: 1, title: 'Upload PDF Document', desc: 'Select any single or multi-page PDF document up to 25 MB.' },
      { step: 2, title: 'Preview & Choose Scale', desc: 'Browse page thumbnails and select standard 1.5x or high-DPI 2.5x rendering.' },
      { step: 3, title: 'Download Images / ZIP', desc: 'Save individual pages as sharp PNG/JPG pictures or download all pages bundled in a ZIP.' },
    ],
    howItWorks:
      'Our PDF to Image Extractor incorporates client-side PDF.js rendering technology. The engine parses the PDF document structure, font vectors, and embedded raster images directly inside browser memory, rasterizing each document page onto a dedicated HTML5 Canvas at high pixel density. Pages can then be exported as individual lossless PNG or compressed JPEG images, or packaged into a unified ZIP archive.',
    benefits: [
      'Extract pages from contracts, slides, reports, and ebooks into sharp image files',
      'High-DPI 2.5x Retina rendering for razor-sharp typography and diagram clarity',
      'One-click ZIP archive packaging for rapid multi-page extraction',
      'Strict client-side privacy: confidential PDF documents are never uploaded to any server',
    ],
    faqs: [
      {
        question: 'Does this tool extract embedded photos or render the full document page?',
        answer: 'It renders the complete document page exactly as you see it in a PDF reader, including all typography, vectors, diagrams, and layout elements, at high resolution.',
      },
      {
        question: 'Can I extract just one specific page instead of the entire document?',
        answer: 'Yes! You can browse through individual pages using the navigation controls and download only the specific page you need, or download all pages at once as a ZIP archive.',
      },
      {
        question: 'Can I use this on password-protected PDF files?',
        answer: 'For security reasons, PDF files must be unlocked prior to rendering. Standard unencrypted PDF documents render immediately in your browser.',
      },
    ],
  },

  'favicon-generator': {
    steps: [
      { step: 1, title: 'Upload Brand Logo / Icon', desc: 'Select any square logo, app icon, or graphic (PNG, SVG, or JPG).' },
      { step: 2, title: 'Preview Icon Suite', desc: 'Inspect live previews across 16x16, 32x32, 48x48, and 180x180 mobile touch sizes.' },
      { step: 3, title: 'Download ZIP & HTML', desc: 'Download the complete structured favicon package with ready-to-paste HTML meta tags.' },
    ],
    howItWorks:
      'The PIXAL LAB Favicon & App Icon Generator scales your master artwork across all standard web and mobile icon specifications: 16x16 (browser tab), 32x32 (taskbar shortcut), 48x48 (desktop icon), 180x180 (Apple touch icon for iPhone/iPad), and 192x192/512x512 (Android Progressive Web App). Using bicubic downsampling, fine lines and brand shapes stay sharp without pixel jitter, bundling all assets into an organized ZIP with pre-written HTML link tags.',
    benefits: [
      'Complete icon suite covering desktop browsers, Apple iOS devices, and Android PWAs',
      'High-quality downsampling preserves brand recognition at tiny 16x16 pixel dimensions',
      'Includes copy-and-paste HTML `<link rel="icon">` code snippet for instant integration',
      'Packaged in an organized ZIP file ready for web deployment with zero upload delays',
    ],
    faqs: [
      {
        question: 'What source image resolution produces the best favicons?',
        answer: 'We recommend uploading a square image of at least 512x512 pixels with a transparent background (PNG or SVG). This provides maximum detail for clean downsampling.',
      },
      {
        question: 'Where do I place the downloaded favicon files on my website?',
        answer: 'Unzip the files and place them in your website root public directory (e.g. /public or /assets), then paste the generated HTML snippet inside your website <head> tag.',
      },
      {
        question: 'Does this generator support Apple Touch Icons for iPhones and iPads?',
        answer: 'Yes! The generated ZIP package includes the official 180x180 apple-touch-icon.png so your website displays a crisp app icon when users save it to their iOS home screen.',
      },
    ],
  },

  'whatsapp-dp-maker': {
    steps: [
      { step: 1, title: 'Upload Portrait or Landscape Photo', desc: 'Select any photo you want to use as your WhatsApp or social profile picture.' },
      { step: 2, title: 'Choose Padding Style', desc: 'Select an aesthetic blurred background expansion or clean solid color border frame.' },
      { step: 3, title: 'Download 1:1 Square DP', desc: 'Export your profile picture perfectly centered with zero unwanted cropping.' },
    ],
    howItWorks:
      'Social platforms like WhatsApp, Instagram, and Twitter require square 1:1 avatars and display them in circular frames, frequently forcing users to crop out friends or key scenery. The PIXAL LAB WhatsApp DP Maker places your uncropped full photo onto a calibrated square canvas, padding outer edges with a Gaussian-blurred replica of the image or solid borders, and provides a real-time circular safe guide so no part of your face is clipped.',
    benefits: [
      'Fit entire rectangular photos into WhatsApp profile pictures with zero cropping',
      'Interactive circular overlay preview guarantees faces and text fit inside social circles',
      'Aesthetic blurred mirror background expansion for a modern, professional look',
      '100% private in-browser generation with crystal-clear high-definition export',
    ],
    faqs: [
      {
        question: 'Why does WhatsApp cut off parts of my profile picture?',
        answer: 'WhatsApp strictly requires a 1:1 square image and masks it into a circular display. Rectangular photos are forced into awkward crops unless padded into a square first.',
      },
      {
        question: 'How does the Safe Circle guide help me?',
        answer: 'The interactive circular overlay preview simulates the exact circular crop WhatsApp and Instagram use, allowing you to position your photo so no faces or borders are cut off.',
      },
      {
        question: 'Can I choose a plain white or black border instead of blur?',
        answer: 'Yes, you can toggle between atmospheric blurred background fills, solid white, dark OLED black, or custom color borders.',
      },
    ],
  },

  'image-joiner': {
    steps: [
      { step: 1, title: 'Select Photos to Stitch', desc: 'Upload two or more photos you want to merge side-by-side or stacked.' },
      { step: 2, title: 'Choose Layout & Spacing', desc: 'Select Horizontal (side-by-side) or Vertical (stacked) orientation and adjust margin gaps.' },
      { step: 3, title: 'Export Merged Image', desc: 'Download your combined composite image in high resolution with matched dimensions.' },
    ],
    howItWorks:
      'The PIXAL LAB Image Joiner & Panorama Stitcher dynamically calculates unified canvas geometry based on all uploaded images. For horizontal stitching, it automatically normalizes images to a common height using proportional aspect scaling to eliminate uneven seams. For vertical stacking, it matches widths before rendering. Users can customize divider border thickness and background colors with instantaneous real-time canvas updates.',
    benefits: [
      'Stitch before-and-after comparisons, panoramic landscape pairs, or vertical comic strips',
      'Automatic proportional dimension matching prevents distorted or stretched photos',
      'Custom gap spacing slider and background color selector',
      'Lossless client-side canvas composition with zero quality loss or watermarks',
    ],
    faqs: [
      {
        question: 'Can I join images with different original dimensions and heights?',
        answer: 'Yes! The tool automatically calculates proportional scaling to match heights in horizontal mode and widths in vertical mode, ensuring clean, flush seams.',
      },
      {
        question: 'What is the best format for before-and-after photo comparisons?',
        answer: 'Horizontal mode (side-by-side) is ideal for before/after edits, fitness progress, and design comparisons, allowing viewers to contrast differences side by side.',
      },
      {
        question: 'Is there a limit on how many photos I can join together?',
        answer: 'You can join multiple photos together in a single sequence. Processing runs directly on your device CPU for lightning-fast real-time rendering.',
      },
    ],
  },

  'youtube-thumbnail-maker': {
    steps: [
      { step: 1, title: 'Upload Background Image', desc: 'Drop any 16:9 photo, video screenshot, or game capture into the editor.' },
      { step: 2, title: 'Customize Title & Badges', desc: 'Add bold high-contrast headline text, highlight badges, and gradient scrims.' },
      { step: 3, title: 'Download 1280x720 HD', desc: 'Export your high-converting YouTube thumbnail optimized under the 2 MB file limit.' },
    ],
    howItWorks:
      'YouTube video performance heavily depends on Click-Through Rate (CTR) and mobile readability. The PIXAL LAB YouTube Thumbnail Maker sets up an exact 1280x720 (16:9) high-definition canvas, adding heavy stroke-outlined typography, gradient backdrop scrims, and vibrant badges designed to stand out against YouTube dark and light themes while staying comfortably under YouTube 2 MB file limit.',
    benefits: [
      'Strict 1280x720 16:9 resolution compliant with official YouTube creator guidelines',
      'High-impact bold typography engineered for maximum legibility on mobile app feeds',
      'Vibrant gradient scrim overlays (Blue-Violet, Emerald, Amber-Rose, Dark Scrim) boost contrast',
      'Fast client-side export guaranteed to be under YouTube 2 MB thumbnail file size cap',
    ],
    faqs: [
      {
        question: 'What are the official YouTube thumbnail requirements?',
        answer: 'YouTube recommends a resolution of 1280x720 pixels (minimum width 640 pixels), 16:9 aspect ratio, under 2 MB in file size, and saved in PNG or JPG format.',
      },
      {
        question: 'How do I ensure thumbnail text is readable on mobile smartphones?',
        answer: 'Use 3 to 5 words in bold uppercase lettering with strong outline strokes and high contrast against the background image so it catches eyes in small mobile feeds.',
      },
      {
        question: 'Will this thumbnail upload to YouTube without file size errors?',
        answer: 'Yes! The exported images are calibrated for high-definition visual punch while keeping total file size well below YouTube 2 MB limit.',
      },
    ],
  },

  'image-watermark-maker': {
    steps: [
      { step: 1, title: 'Upload Your Photo', desc: 'Select any artwork, photograph, or graphic you want to protect.' },
      { step: 2, title: 'Configure Watermark Text', desc: 'Enter your brand name or copyright, choose single or 45-degree tiled pattern, and set opacity.' },
      { step: 3, title: 'Export Protected Image', desc: 'Download your watermarked photo ready for safe sharing across social networks and websites.' },
    ],
    howItWorks:
      'The PIXAL LAB Image Watermark Maker renders customizable copyright typography directly into canvas pixel data using 2D rotational matrix transformations. Users can position a discreet copyright badge in the center or apply a 45-degree repeating diagonal lattice across the entire image. Opacity, font scale, and text colors are fully adjustable to balance visual protection with aesthetic presentation.',
    benefits: [
      'Protect digital photos, artwork, and client proofs from unauthorized reposting and theft',
      'Repeating 45-degree tiled diagonal lattice prevents simple cropping or content-aware removal',
      'Smooth opacity slider (10% to 100%) to preserve artwork aesthetics while ensuring protection',
      '100% private in-browser watermarking: unwatermarked originals are never uploaded to servers',
    ],
    faqs: [
      {
        question: 'Should I use a single watermark or a repeating tiled pattern?',
        answer: 'For public portfolios and client proofing, a repeating 45-degree tiled pattern provides maximum protection against unauthorized cropping and AI removal tools.',
      },
      {
        question: 'Can I adjust the transparency of the watermark text?',
        answer: 'Yes, the opacity slider lets you fine-tune text transparency from a subtle translucent watermark to a bold, high-contrast copyright stamp.',
      },
      {
        question: 'Does adding a watermark lower the resolution of my photo?',
        answer: 'No. The watermark is composited directly onto your original high-resolution pixel dimensions without downsampling or degradation.',
      },
    ],
  },

  'image-filters': {
    steps: [
      { step: 1, title: 'Load Photo into Studio', desc: 'Select any portrait, landscape, architecture, or street photography image.' },
      { step: 2, title: 'Select Filter & Intensity', desc: 'Choose Vintage Film, Noir Monochrome, Cyberpunk, Warm Golden Hour, or Sepia with live slider.' },
      { step: 3, title: 'Instant High-Res Export', desc: 'Save your professionally color-graded photo with zero watermarks or subscription fees.' },
    ],
    howItWorks:
      'Our Cinematic Photo Filters engine performs mathematical color matrix transformations directly on 32-bit pixel RGBA arrays via HTML5 Canvas. Each preset modifies color temperature, split toning, highlight rolloff, and luminance curves in real time. The interactive intensity slider smoothly blends filtered pixel buffers with the original image, enabling subtle cinematic nuances or dramatic artistic stylization.',
    benefits: [
      'Curated professional presets: Vintage Film, Noir B&W, Cyberpunk Neon, Golden Hour & Sepia',
      'Smooth 0% to 100% intensity blending slider for precision aesthetic control',
      'Instant real-time canvas rendering with zero waiting in server queues',
      '100% private client-side processing: your personal photography stays on your device',
    ],
    faqs: [
      {
        question: 'Can I fine-tune the strength of the color grading filter?',
        answer: 'Yes! The intensity slider allows you to blend the filter from 0% (natural original) to 100% (full dramatic effect) to achieve the exact aesthetic you want.',
      },
      {
        question: 'Which filter is recommended for street photography and portraits?',
        answer: 'Vintage Film creates a timeless analog look with soft highlights, while Noir Black & White adds striking dramatic contrast and shadow depth to portraits.',
      },
      {
        question: 'Does applying filters reduce image sharpness or remove EXIF data?',
        answer: 'The filter only modifies RGB color values. Pixel dimensions and sharpness are maintained at full original resolution.',
      },
    ],
  },

  'image-blur-tool': {
    steps: [
      { step: 1, title: 'Select Image to Redact', desc: 'Upload any photo containing sensitive data, faces, phone numbers, or license plates.' },
      { step: 2, title: 'Choose Blur or Pixelate', desc: 'Switch between smooth Gaussian blur and retro mosaic pixelation and adjust intensity.' },
      { step: 3, title: 'Download Anonymized Image', desc: 'Export your sanitized image with sensitive details permanently obscured.' },
    ],
    howItWorks:
      'The PIXAL LAB Privacy Blur & Pixelate Redactor executes client-side kernel convolution and spatial downsampling. In Gaussian mode, a multi-pass mathematical blur filter diffuses pixel color values across neighboring coordinates. In Mosaic Pixelate mode, the canvas groups pixels into discrete geometric blocks and averages their color values, irreversibly eliminating underlying text, numbers, or biometric features.',
    benefits: [
      'Irreversible redaction permanently destroys sensitive visual data beneath the blur',
      'Gaussian blur mode for aesthetic soft backgrounds and portrait defocusing',
      'Mosaic Pixelate mode for standard legal, journalistic, and identity redaction',
      '100% offline safety: unblurred images with sensitive data are NEVER uploaded to any cloud',
    ],
    faqs: [
      {
        question: 'Can someone reverse the blur or pixelation to read my blurred text?',
        answer: 'No. Pixelation mathematically averages color blocks and permanently discards the original pixel information, making it impossible to reconstruct the underlying text or numbers.',
      },
      {
        question: 'Is it safe to redact credit cards, IDs, and car license plates here?',
        answer: 'Yes! Because PIXAL LAB runs 100% in your local browser memory, your unredacted document is never transmitted across the internet to any server.',
      },
      {
        question: 'What is the difference between Gaussian blur and mosaic pixelate?',
        answer: 'Gaussian blur creates a smooth, dreamy defocus effect popular for portraits, while mosaic pixelate creates crisp blocky tiles commonly used in media redactions.',
      },
    ],
  },

  'border-corner-maker': {
    steps: [
      { step: 1, title: 'Upload Photo or Graphic', desc: 'Select any product screenshot, UI mockup, or social media image.' },
      { step: 2, title: 'Set Radius & Border Style', desc: 'Adjust the corner radius slider (0-200px), border thickness, and pick a custom frame color.' },
      { step: 3, title: 'Download Rounded Image', desc: 'Export as transparent PNG with clipped rounded corners or crisp JPG with colored borders.' },
    ],
    howItWorks:
      'This studio utilizes HTML5 Canvas 2D path clipping (`arcTo` and `roundRect` path geometries) to sculpt corners into smooth squircle or pill contours. When exporting as PNG, outer corner areas are rendered with transparent alpha channels, allowing the rounded image to sit seamlessly over any background. Border frames are stroke-rendered around the inner clipping boundary for uniform thickness.',
    benefits: [
      'Create stylish Apple-inspired squircle rounded corners for UI mockups and slide decks',
      'Transparent PNG corner clipping ensures seamless placement over dark or light web backgrounds',
      'Custom border thickness and curated color palette for modern social media posts',
      'Pixel-perfect anti-aliased corner curves without jagged edges',
    ],
    faqs: [
      {
        question: 'How do I ensure the rounded corners have a transparent background?',
        answer: 'Export your image in PNG format. PNG supports alpha transparency, leaving the corner cutouts transparent so your image blends cleanly on any website or presentation.',
      },
      {
        question: 'What corner radius looks best for website UI mockups and screenshots?',
        answer: 'A corner radius of 16px to 32px provides a modern, clean Apple-like aesthetic without cutting off too much of the screenshot content.',
      },
      {
        question: 'Can I add a colored border without rounding the corners?',
        answer: 'Yes! Keep the corner radius slider at 0px and adjust the border thickness and color controls to frame your photo with clean rectangular borders.',
      },
    ],
  },

  'qr-code-reader': {
    steps: [
      { step: 1, title: 'Upload QR Image / Screenshot', desc: 'Select any photo, screenshot, flyer, or picture containing a 2D QR code or barcode.' },
      { step: 2, title: 'Instant In-Browser Scan', desc: 'Our computer vision engine automatically locates and decodes the QR matrix.' },
      { step: 3, title: 'Copy or Open Decoded Content', desc: 'Inspect the decoded website URL, WiFi credentials, or text with one-click clipboard copying.' },
    ],
    howItWorks:
      'The PIXAL LAB QR Code Scanner & Decoder embeds the open-source `jsQR` computer vision engine. When you upload an image, the tool draws it onto an off-screen canvas buffer, analyzes pixel binarization thresholds, and locates the three square position detection patterns at the corners. It then reconstructs the 2D matrix, applies Reed-Solomon error correction, and extracts the raw payload without requiring a physical camera.',
    benefits: [
      'Decode QR codes from saved photos and screenshots without needing a second phone camera',
      'Extract website URLs, WiFi network passwords, email addresses, and text snippets',
      'One-click direct copy to clipboard and verified URL navigation link',
      '100% private in-browser decoding: scanned QR images and credentials never touch a server',
    ],
    faqs: [
      {
        question: 'Can I decode a QR code from a picture saved on my computer or phone?',
        answer: 'Yes! This tool is specifically designed to decode QR codes from saved photos, screenshots, and downloaded images without needing a camera.',
      },
      {
        question: 'Is it safe to scan confidential WiFi passwords or private QR codes here?',
        answer: 'Completely safe. The decoding runs 100% inside your local web browser using client-side JavaScript. Zero image data or decoded text is ever transmitted over the network.',
      },
      {
        question: 'Why might a QR code fail to scan?',
        answer: 'If the image is extremely blurry, poorly lit, or cropped so the three corner alignment squares are missing, the scanner may not detect the matrix. Make sure the QR code is clear and fully visible.',
      },
    ],
  },

  'color-picker-palette': {
    steps: [
      { step: 1, title: 'Upload Any Photo or Graphic', desc: 'Drop any design mockup, illustration, or photo into the color analysis workspace.' },
      { step: 2, title: 'Hover or Tap to Inspect', desc: 'Move the magnified pixel loupe across the image to inspect exact HEX and RGB values.' },
      { step: 3, title: 'Copy Colors & Palettes', desc: 'Copy single pixel HEX codes or grab the top 6 dominant harmonic palette swatches with one click.' },
    ],
    howItWorks:
      'The PIXAL LAB Image Color Picker & Palette Extractor reads pixel color values using HTML5 Canvas 2D `getImageData` pixel arrays. The interactive loupe magnifies a 9x9 pixel grid around your cursor, showing the exact center pixel color with instantaneous HEX and RGB conversions. Simultaneously, a k-means color quantization algorithm samples pixel distribution across the image to extract the top 6 dominant harmonic colors.',
    benefits: [
      'Magnified pixel loupe provides sub-pixel inspection accuracy for designers and developers',
      'Instant HEX and RGB format readouts with one-click clipboard copying',
      'Automated extraction of top 6 dominant harmonic color palette swatches',
      'Works completely in-browser with zero uploads, ideal for proprietary design mockups',
    ],
    faqs: [
      {
        question: 'How do I copy a color code to my clipboard?',
        answer: 'Click or tap any color swatch or click anywhere on the image with the loupe tool. The HEX code is instantly copied to your clipboard ready for Figma, CSS, or Photoshop.',
      },
      {
        question: 'How does the dominant palette generator choose colors?',
        answer: 'The tool uses color quantization algorithms to group similar pixel tones into clusters, identifying the 6 most prominent and harmonic color values across the entire photo.',
      },
      {
        question: 'Can I inspect colors from high-resolution screenshots and logos?',
        answer: 'Yes! The color picker reads native pixel data from images up to 40 MB, allowing you to accurately extract brand colors from high-res UI designs and photos.',
      },
    ],
  },

  'meme-generator': {
    steps: [
      { step: 1, title: 'Upload Meme Template', desc: 'Select any viral template, reaction image, or personal photo from your device.' },
      { step: 2, title: 'Add Top & Bottom Captions', desc: 'Type your captions, adjust font size, and customize black outline stroke thickness.' },
      { step: 3, title: 'Download High-Res Meme', desc: 'Export your finished meme immediately with zero watermarks or website branding.' },
    ],
    howItWorks:
      'The PIXAL LAB Viral Meme Generator renders classic Impact uppercase typography directly onto an HTML5 Canvas. It utilizes dual-pass text rasterization: first drawing a heavy black outline stroke around the glyph contours, followed by a crisp white fill pass. This mathematical outline contrast ensures captions remain readable over any light, dark, or busy photographic background.',
    benefits: [
      'Classic bold Impact typography with customizable black outline stroke width',
      'Top and bottom caption support with live interactive canvas preview',
      '100% watermark-free exports: your memes are completely clean and unbranded',
      'Instant high-resolution PNG download with zero account signup or waiting',
    ],
    faqs: [
      {
        question: 'Why do viral memes use white text with a black outline?',
        answer: 'White lettering with a solid black outline is universally readable against any background, whether the image beneath is pitch black, bright white, or colorful.',
      },
      {
        question: 'Can I leave the top or bottom caption blank?',
        answer: 'Yes! You can fill in only the top caption, only the bottom caption, or both depending on the meme style you are creating.',
      },
      {
        question: 'Does PIXAL LAB add any watermark to generated memes?',
        answer: 'Never. All memes exported from PIXAL LAB are 100% watermark-free and completely owned by you.',
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
      `PIXAL LAB ${toolName} operates entirely inside your web browser utilizing modern HTML5 Canvas, WebGL, and Web API graphics technology. Unlike traditional cloud converter services that transmit your private images across public networks to remote servers, our client-side engine executes all mathematical image transformations locally on your device CPU. This architectural advantage ensures total personal privacy, zero upload waiting times, and unrestricted usage without data collection.`,
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
        answer: `Yes, all tools on PIXAL LAB are 100% free with unlimited daily usage, no account signup required, and zero hidden costs.`,
      },
      {
        question: `What formats are supported by ${toolName}?`,
        answer: `Most common formats including JPG, PNG, WebP, and standard image formats are supported with instantaneous conversion.`,
      },
      {
        question: `Can I use ${toolName} on my phone?`,
        answer: `Yes, PIXAL LAB is built with a responsive interface that functions smoothly on Android and iOS mobile devices.`,
      },
    ],
  };
}
