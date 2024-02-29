import Image from "next/image";
import { Frontend_skill } from "../resource";

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
        <h4>
          2 Years of Experienced Frontend Developer | Expertise in React.js,
          Next.js, TypeScript, Redux, Tailwind and React Ecosystem
        </h4>

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
