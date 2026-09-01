// Default site copy. The admin can override any of these via the dashboard;
// values are stored in the site_content table keyed by the same keys.
// Public pages merge DB overrides over these defaults.

export const CONTENT_DEFAULTS: Record<string, string> = {
  // Brand / contact
  'brand.tagline': 'Lifestyle & Portrait Photography',
  'contact.email': 'misuenophoto@gmail.com',
  'contact.location': 'Based in Bryan, Ohio',

  // Home
  'home.hero.eyebrow': 'Lifestyle & Portrait Photography',
  'home.hero.title': 'Capturing your dream, one frame at a time',
  'home.hero.subtitle':
    "Mi Sueño by Angi Scott is a celebration of life's quiet, beautiful moments — told with a refined, cinematic eye.",
  'home.vision.eyebrow': 'The Vision',
  'home.vision.title':
    'Timeless imagery crafted with intention, light, and a love for the stories that make us who we are.',
  'home.vision.body':
    'From intimate portraits to candid lifestyle sessions and celebrations, every photograph is made to feel as genuine as the moment it captures — elegant, warm, and unmistakably yours.',
  'home.cta.eyebrow': "Let's Create",
  'home.cta.title': 'Ready to tell your story?',

  // About
  'about.eyebrow': 'The Photographer',
  'about.title': "Hi, I'm Angi Scott",
  'about.story.p1':
    'Angi Scott is the owner of Mi Sueño Photography in Bryan, Ohio, but photography has been part of her life long before she ever turned it into a business. She grew up watching and working alongside her dad, who also photographed weddings and quinceañeras, and eventually went to school for photography herself. Life happened, though, and photography got put on the back burner while she raised her three daughters.',
  'about.story.p2':
    'What finally pushed Angi to pick up the camera again was actually one of her daughters. When her oldest was getting ready to leave for college and follow her own dreams, she looked at Angi and basically said, “Mom, I’m living my dream. Why aren’t you living yours?” That hit home, big time. Angi had spent years telling her girls to go after what they wanted, helping them achieve their goals, and she realized it was probably time she listened to her own advice. That’s where Mi Sueño Photography came from—“Mi Sueño” means “My Dream.”',
  'about.story.p3':
    'Her photography isn’t really about making everyone stand there and smile at the camera. She likes things that are different and have some personality to them. She plays around with flowing dresses, smoke bombs, colored lighting, fisheye lenses, and whatever else she can use to make a shoot feel like it actually belongs to the person she’s photographing. She’s also the first to admit she’s still learning. She even jokes that she thinks she’s “a 4” and is working her way toward being a 10.',
  'about.story.p4':
    'Quinceañera photography is especially important to her because it brings everything back around to her own family, childhood, and life itself. Her mom handmade her quinceañera dress, and those memories are still very much a part of why she loves photographing these celebrations today.',
  'about.story.p5':
    'There’s another side of Angi’s story that makes her decision to chase this dream mean even more. She is an 18-year ovarian cancer survivor. Her daughters were very young when she was diagnosed, and instead of spending all of her energy worrying about what might happen, she says she put her faith in God and focused on taking care of her girls.',
  'about.story.p6':
    'Her dad is still a big part of her photography story too. He’s the reason she picked up a camera in the first place, and even though her photography looks very different today than it did when she was younger, that connection is still there.',
  'about.story.p7':
    'Really, Angi’s story isn’t just about becoming a photographer. It’s about finally giving herself permission to do something she had wanted to do for years. She raised her daughters telling them to chase their dreams, survived something that could have completely changed the course of her life, and eventually realized she deserved to chase one of her own too.',
  'about.quote': 'Mom, I’m living my dream. Why aren’t you living yours?',
}

export type ContentMap = Record<string, string>
