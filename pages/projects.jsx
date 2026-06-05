import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../lib/projects';
import styles from '../styles/ProjectsPage.module.css';

const ProjectsPage = ({ projects }) => {
  return (
    <>
      <h3>Stuff I've Built So Far</h3>
      <div className={styles.container}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
};

// Server-rendered so admin CRUD changes appear immediately.
export async function getServerSideProps() {
  let projects = [];
  try {
    projects = await getProjects();
  } catch (err) {
    console.error('[projects] failed to load:', err.message);
  }

  return {
    props: { title: 'Projects', projects },
  };
}

export default ProjectsPage;
