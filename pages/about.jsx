import Image from "next/image";

export const Frontend_skill = [
  {
    skill_name: "Html 5",
    image: "/html.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Css",
    image: "/css.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Java Script",
    image: "/js.png",
    width: 65,
    height: 65,
  },
  {
    skill_name: "React",
    image: "/react.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Next js 13",
    image: "/next.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Type Script",
    image: "/ts.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "React Query",
    image: "/reactquery.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Redux",
    image: "/redux.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Tailwind Css",
    image: "/tailwind.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Material UI",
    image: "/mui.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "Ant Design",
    image: "/antd.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "framer motion",
    image: "/framer.png",
    width: 80,
    height: 80,
  },
  {
    skill_name: "firebase",
    image: "/firebase.png",
    width: 80,
    height: 80,
  },
  
];

const AboutPage = () => {
  return (
    <>
      <h1>A Little Bit About Me</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
          padding: "10px 0",
        }}
      >
        {Frontend_skill.map(({ skill_name, image, width, height }, index) => (
          <div key={index} style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column", gap:"10px", margin:"20px"}}>
            <Image src={image} width={width} height={height} alt={skill_name} />
            <p>{skill_name}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          margin: "20px 0",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h5>
          2 Years of Experienced Frontend Developer | Expertise in React.js,
          Next.js, TypeScript, Redux, Tailwind and React Ecosystem
        </h5>

        <h5>
          Passionate about crafting exceptional user experiences through
          cutting-edge frontend technologies. With a proven track record in
          developing dynamic web applications, I specialize in leveraging
          React.js, Next.js, TypeScript, Redux, and a diverse range of frontend
          libraries to create seamless and responsive interfaces. My dedication
          to clean code, performance optimization, and UI/UX design principles
          allows me to deliver polished products that resonate with users.
        </h5>

        <ul style={{ padding: "0 20px" }}>
          <li>
            <h5>
              React.js | Next.js | TypeScript | Redux Frontend Architecture |
            </h5>
          </li>
          <li>
            <h5>
              Component-driven Development Responsive Design | Cross-browser
            </h5>
          </li>
          <li>
            <h5>
              Compatibility Performance Optimization | User-Centric Approach
            </h5>
          </li>
        </ul>

        <div style={{ marginTop: "20px" }}>
          <h4>
            Experienced React developer adept at driving performance
            enhancements and delivering impactful solutions.
          </h4>
        </div>

        <ul style={{ padding: "0 20px" }}>
          <li>
            <h5>
              Leveraged React, Next.js, and Ant Design to optimize UI/UX,
              resulting in a 40% reduction in page load times.
            </h5>
          </li>

          <li>
            <h5>
              Implemented TypeScript, Redux, React Router, WebSocket, and
              Firebase to enhance application functionality and scalability,
              leading to a 25% increase in user engagement.
            </h5>
          </li>

          <li>
            <h5>
              Spearheaded the adoption of Agile methodologies, improving team
              productivity by 30% and reducing time-to-market by 20%.
            </h5>
          </li>

          <li>
            <h5>
              Conducted comprehensive code reviews, resulting in a 50% decrease
              in post-release defects and improving overall code quality.
            </h5>
          </li>

          <li>
            <h5>
              Actively contributed to knowledge-sharing initiatives, resulting
              in a 15% increase in team member skill proficiency and
              collaboration.
            </h5>
          </li>

          <li>
            <h5>
              Developed automated testing strategies, leading to a 35% decrease
              in manual testing efforts and improving release stability.
            </h5>
          </li>

          <li>
            <h5>
              Implemented performance monitoring tools, resulting in a 20%
            </h5>
          </li>
        </ul>
      </div>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: { title: "About" },
  };
}

export default AboutPage;
