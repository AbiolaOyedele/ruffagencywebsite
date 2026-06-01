import PageHeader from '@/components/admin/features/PageHeader'
import ProjectForm from '@/components/admin/features/ProjectForm'

export default function NewProjectPage() {
  return (
    <>
      <PageHeader title="New Project" description="Add a new project to the Work page." />
      <ProjectForm />
    </>
  )
}
