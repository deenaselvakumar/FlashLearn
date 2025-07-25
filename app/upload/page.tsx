"use client"

import { AppLayout } from "@/components/app-layout"
import { PPTUpload } from "@/components/ppt-upload"

export default function UploadPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <PPTUpload />
      </div>
    </AppLayout>
  )
}
