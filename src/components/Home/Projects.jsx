"use client";
import React from 'react';
import ProjectCard from './ProjectCard';

const Projects = ({ projects, handleRefresh, loading, error }) => {
 
  // Ensure projects is an array, fallback to empty array if not
  const projectList = Array.isArray(projects) ? projects : [];


  return (
    <div className='w-full max-w-[900px] mx-auto'>
      {/* Display loading state */}
      {loading && <p className="text-gray-500">Loading projects...</p>}

      {/* Display error state if any */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Project list */}
      <div className='flex flex-col gap-3'>
        {!loading && !error && projectList.length > 0 ? (
          projectList.map((project) => (
            <ProjectCard key={project.id} data={project} handleRefresh={handleRefresh} />
          ))
        ) : (
          !loading && !error && (
            <p className="text-gray-500">No projects found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Projects;
