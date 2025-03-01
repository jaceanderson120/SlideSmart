import { AzureOpenAI } from "openai";
import { NextResponse } from "next/server";

// For handling file uploads in Next.js App Router
async function parseFormData(request) {
  const formData = await request.formData();
  const messages = JSON.parse(formData.get("messages"));
  const extractedData = JSON.parse(formData.get("extractedData"));

  let base64Image = null;
  const imageFile = formData.get("image");

  if (imageFile) {
    const fileType = imageFile.type;
    if (fileType.startsWith("image/")) {
      // Convert the image to base64
      const bytes = await imageFile.arrayBuffer();
      base64Image = Buffer.from(bytes).toString("base64");

      // Ensure the base64 string is properly formatted
      base64Image = `data:${fileType};base64,${base64Image}`;
    } else {
      throw new Error("The uploaded file is not an image");
    }
  }

  return { messages, extractedData, base64Image };
}

export const config = {
  runtime: "edge",
};

export default async function POST(request) {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const apiVersion = "2024-08-01-preview";
  const deployment = "gpt-4o";

  const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

  try {
    const { messages, extractedData, base64Image } = await parseFormData(
      request
    );

    const formattedMessages = [
      {
        role: "system",
        content: `You are a friendly mini golden doodle and a professor named Sola who is answering questions from college students. You are a chatbot that is displayed on an HTML page that has the following content on it: ${JSON.stringify(
          extractedData
        )}.`,
      },
      ...messages.slice(0, -1).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    ];

    if (base64Image) {
      const lastMessage = messages[messages.length - 1];
      formattedMessages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: lastMessage.text,
          },
          {
            type: "image_url",
            image_url: { url: base64Image }, // Use the correctly formatted base64 URL
          },
        ],
      });
    } else {
      const lastMessage = messages[messages.length - 1];
      formattedMessages.push({
        role: lastMessage.sender === "user" ? "user" : "assistant",
        content: lastMessage.text,
      });
    }

    // Create a ReadableStream for streaming the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Changed from openai.completions.create to openai.chat.completions.create
          const completion = await openai.chat.completions.create({
            model: deployment,
            messages: formattedMessages,
            stream: true,
          });

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            new TextEncoder().encode(`Error: ${error.message}`)
          );
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "There was an error processing your request: " + error.message },
      { status: 500 }
    );
  }
}
