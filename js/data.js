/* ============================================================
   DUMMY DATA — replace with your own content.
   `image` fields can be real file paths (e.g. "assets/img/foo.png")
   once you add real media; placeholders render automatically
   when an image fails to load or is left blank.
   ============================================================ */

const SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python",
  "HTML5", "CSS3", "SQL", "MongoDB", "Git"
];

const PROJECTS = [
  {
    id: "proj-1",
    title: "Docusign imitation app",
    shortDesc: "A scalable realtime document signing app. Based on Docusign.",
    longDesc: "A full-featured realtime document signing application supporting multiple documents, user presence, signing indicators, and document history. The app uses React and supabase for real-time updates. These app was my first built using AI and was intended to see how quickly pre-planned designs and decisions coud be implemented. I found it a good learning experience with some feedback/notes to improve on. Whilst the AI generated initial features fast for the front end it struggled to succesfully pair with the backend logic and real-time synchronization, requiring manual troubleshooting. Additionally i used 41% of my monthly copilot tokens in 3 hours of coding and debugging.",
    tags: ["React", "SQL","Supabase"],
    images: [
      "assets/images/proj-1/image.png",
      "assets/images/proj-1/2.png",
      "assets/images/proj-1/3.png",
      "assets/images/proj-1/4.png",
      "assets/images/proj-1/5.png"
    ],
    repo: "https://docusign-1.ai.studio/"
  },
  {
    id: "proj-2",
    title: "Python car park counter",
    shortDesc: "A Python application to count cars in a parking lot using computer vision.",
    longDesc: "A Python-based car park counter that uses computer vision techniques to detect and count vehicles entering and exiting a parking lot. The system provides real-time analytics and historical data tracking. Bounding boxes where used to set car park spaces while cars were reduced into a gradient map via adaptive thresholding. Pixels where them summed to determine occupancy for a given parking space.",
    tags: ["Python", "OpenCV"],
    images: [
      "assets/images/proj-2/image.png",
      "assets/images/proj-2/2.png",
      "assets/images/proj-2/3.png",
      "assets/images/proj-2/video.mp4"
    ],
    repo: "https://github.com/Phoenix-Wiese/CarParkVision"
  },
  {
    id: "proj-3",
    title: "Data visualizer",
    shortDesc: "A interactive data visualization using javascript and D3.js.",
    longDesc: "An interactive data visualization tool built using JavaScript and D3.js. It allows users to explore complex datasets through dynamic charts, graphs, and other visual elements. The project emphasizes real-time updates and responsive design for an engaging user experience. This visualization prokect was marked HD and focused on Australia's Iron ore trade economy.",
    tags: ["JavaScript", "D3.js", "HTML", "CSS"],
    images: [
      "assets/images/proj-3/image.png",
      "assets/images/proj-3/2.png",
      "assets/images/proj-3/3.png",
      "assets/images/proj-3/4.png"
    ],
    repo: "https://phoenix-wiese.github.io/FIT2179A2/"
  }
];
