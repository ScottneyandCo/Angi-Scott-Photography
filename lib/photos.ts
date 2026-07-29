export type Photo = {
  src: string
  alt: string
  category: 'Portraits' | 'Couples' | 'Events' | 'Lifestyle' | 'Nature' | 'Travel'
  span?: boolean
}

export const photos: Photo[] = [
  {
    src: '/gallery/portrait-cowboy-horse.jpg',
    alt: 'Senior portrait of a young man in a cowboy hat beside his horse at golden hour',
    category: 'Portraits',
  },
  {
    src: '/gallery/couple-autumn-dip.jpg',
    alt: 'Groom dipping and kissing his bride among autumn trees',
    category: 'Couples',
  },
  {
    src: '/gallery/portrait-man-glasses-bw.jpg',
    alt: 'Black and white portrait of a man with round glasses in a plant-filled room',
    category: 'Portraits',
    span: true,
  },
  {
    src: '/gallery/event-fair-queen-ferris.jpg',
    alt: 'Fair queen in an orange gown in front of a lit ferris wheel at night',
    category: 'Events',
    span: true,
  },
  {
    src: '/gallery/lifestyle-fabric-field-bw.jpg',
    alt: 'Black and white portrait of a woman with flowing fabric catching the wind in a field',
    category: 'Lifestyle',
  },
  {
    src: '/gallery/portrait-young-miss-red.jpg',
    alt: 'Studio portrait of a young girl in a red dress with a Young Miss sash',
    category: 'Portraits',
  },
  {
    src: '/gallery/couple-church.jpg',
    alt: 'Bride and groom portrait inside a church with stained glass',
    category: 'Couples',
    span: true,
  },
  {
    src: '/gallery/event-dancer-red.jpg',
    alt: 'Dancer in a black leotard with flowing red fabric in a studio',
    category: 'Events',
    span: true,
  },
  {
    src: '/gallery/lifestyle-soccer-goal.jpg',
    alt: 'Soccer senior standing at the goal with cleats and ball in the foreground',
    category: 'Lifestyle',
    span: true,
  },
  {
    src: '/gallery/portrait-woman-apron.jpg',
    alt: 'Portrait of a woman in glasses and a green apron among houseplants',
    category: 'Portraits',
  },
  {
    src: '/gallery/couple-rings.jpg',
    alt: 'Close-up of a bride and groom holding hands, showing their wedding rings',
    category: 'Couples',
    span: true,
  },
  {
    src: '/gallery/lifestyle-cowgirl-horse-bw.jpg',
    alt: 'Black and white of a cowgirl walking with a white horse in a field',
    category: 'Lifestyle',
  },
  {
    src: '/gallery/portrait-fire-chief.jpg',
    alt: 'Formal studio portrait of a fire chief in dress uniform',
    category: 'Portraits',
  },
  {
    src: '/gallery/event-fair-queen-crown.jpg',
    alt: 'Fair queen holding her crown at a carnival at night',
    category: 'Events',
    span: true,
  },
  {
    src: '/gallery/portrait-girl-braids-bw.jpg',
    alt: 'Black and white portrait of a girl with braids crouching in a dress',
    category: 'Portraits',
    span: true,
  },
  {
    src: '/gallery/portrait-girl-red-chin.jpg',
    alt: 'Studio portrait of a young girl in a red dress resting her hand on her chin',
    category: 'Portraits',
  },
  {
    src: '/gallery/portrait-man-blazer.jpg',
    alt: 'Moody portrait of a man in a black blazer and round glasses',
    category: 'Portraits',
    span: true,
  },
  {
    src: '/gallery/lifestyle-soccer-net.jpg',
    alt: 'Soccer player sitting against the net in a purple and gold uniform',
    category: 'Lifestyle',
    span: true,
  },
]

export const categories = [
  'All',
  'Portraits',
  'Couples',
  'Events',
  'Lifestyle',
  'Nature',
  'Travel',
] as const
