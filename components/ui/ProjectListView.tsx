import { Project } from "./DashboardClient";
import { ProjectListRow } from "./ProjectListRow";

export function ProjectListView({ projects }: { projects: Project[] }) {
  return (
    <div className="border border-editor-border rounded overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_120px_120px_100px] gap-4 px-4 py-2 bg-editor-panel-header border-b border-editor-border">
        {["", "Name", "Modified", "Created", ""].map((h, i) => (
          <span
            key={i}
            className="text-[11px] font-semibold uppercase tracking-wide text-editor-text-muted"
          >
            {h}
          </span>
        ))}
      </div>
      {/* Rows */}
      {projects.map((project) => (
        <ProjectListRow key={project.id} project={project} />
      ))}
    </div>
  );
}
