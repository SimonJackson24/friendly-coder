import React from 'react';
import { useParams } from 'react-router-dom';

export default function ProjectDetail() {
  const { id } = useParams();

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-6">Project Details</h1>
      <p className="text-lg text-muted-foreground">
        Viewing project {id}
      </p>
    </div>
  );
}