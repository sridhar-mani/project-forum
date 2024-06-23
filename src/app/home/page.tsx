import { Section } from "./Section"
import { getAllSections, getAllTopics } from "@projectforum/server/db/queries"
import { getAllDiscussionThreads } from "@projectforum/server/db/queries"
import SectionForm from "./SectionForm"

export default async function HomePage() {
  const sections = await getAllSections()

  const sectionsWithTopicsAndThreads = await Promise.all(
    sections.map(async (section) => {
      const topics = await getAllTopics(section.id)
      const topicsWithThreads = await Promise.all(
        topics.map(async (topic) => {
          const threads = await getAllDiscussionThreads(topic.id)
          return { ...topic, threads }
        })
      )
      return { ...section, topics: topicsWithThreads }
    })
  )

  console.log(sectionsWithTopicsAndThreads)

  return (
    <div>
      <SectionForm />
      <Section sections={sectionsWithTopicsAndThreads} />
    </div>
  )
}