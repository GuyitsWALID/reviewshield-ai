import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { requireUser } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ reviewId: string }> }
) {
  const auth = await requireUser(request);
  if (auth.error || !auth.user) {
    return auth.error!;
  }

  const { reviewId } = await context.params;

  const { data: review } = await auth.supabase
    .from("reviews")
    .select("id,author_name,comment,risk_score,risk_level,detection_reason,location_name,created_at")
    .eq("id", reviewId)
    .eq("user_id", auth.user.id)
    .single();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  page.drawText("ReviewShield Evidence Package", {
    x: 40,
    y: 800,
    size: 18,
    font: bold,
    color: rgb(0.1, 0.2, 0.5),
  });

  const lines = [
    `Generated: ${new Date().toISOString()}`,
    `Location: ${review.location_name ?? "Unknown"}`,
    `Author: ${review.author_name ?? "Unknown"}`,
    `Review Date: ${review.created_at ? new Date(review.created_at).toLocaleString() : "Unknown"}`,
    `Risk Score: ${review.risk_score ?? 0}%`,
    `Risk Level: ${review.risk_level ?? "unknown"}`,
    "",
    "Detection Rationale:",
    `${review.detection_reason ?? "No rationale captured"}`,
    "",
    "Review Content:",
    `${review.comment ?? "No content"}`,
  ];

  let y = 770;
  for (const line of lines) {
    page.drawText(line, {
      x: 40,
      y,
      size: 11,
      font,
      color: rgb(0.1, 0.1, 0.1),
      maxWidth: 510,
      lineHeight: 14,
    });
    y -= 18;
    if (y < 60) {
      break;
    }
  }

  const bytes = await pdf.save();
  const safeBytes = Uint8Array.from(bytes);
  const blob = new Blob([safeBytes], { type: "application/pdf" });

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="evidence-${review.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
