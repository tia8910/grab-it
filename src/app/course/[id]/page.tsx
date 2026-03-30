import { ALL_COURSES } from "@/lib/courses";
import CourseDetail from "@/components/CourseDetail";

export function generateStaticParams() {
  return ALL_COURSES.map((course) => ({ id: course.id }));
}

export default function Page() {
  return <CourseDetail />;
}
