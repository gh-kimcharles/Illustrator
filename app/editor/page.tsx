import EditorShell from "@/components/EditorShell";

// update: now accepts an optional ?projectId= query param
// if present: loads that project into the store on mount

interface Props {
  searchParams: Promise<{ projectId?: string }>;
}
const EditorPage = async ({ searchParams }: Props) => {
  const { projectId } = await searchParams;
  return <EditorShell projectId={projectId} />;
};

export default EditorPage;
