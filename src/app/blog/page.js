// app/blog/page.js
import {
  getAllDocuments,

} from "@/lib/context/article";
import "./blog.css";

import BlogContent from "@/components/BlogContent";

// This component is a Server Component by default in app directory
export default async function Blog() {
  const { data: initialData, lastId } = await getAllDocuments();

  return (
    
    <BlogContent initialData={initialData} lastId={lastId}  className="blogContent"/>
  );
}
