# AI Alt text generator

This is a Next.js application that generates alt text for images that you upload. It's powered by [Langflow](https://www.langflow.org/?utm_medium=referral&utm_source=devrel&utm_campaign=alttextr) and [OpenAI's gpt-4.0-mini](https://platform.openai.com/docs/models/gpt-4o-mini).

You can try the application out at [https://alttextr.vercel.app/](https://alttextr.vercel.app/).

![The application in action, when you select an image you can choose to add extra description or just submit. After submitting, the generated alt text is show in a textarea.](./public/example.gif)

## What you'll need

You will need Langflow installed and running. You can either install [Langflow Desktop](https://www.langflow.org/desktop?utm_medium=referral&utm_source=devrel&utm_campaign=alttextr) or follow [these alternative installation instructions](https://docs.langflow.org/get-started-installation?utm_medium=referral&utm_source=devrel&utm_campaign=alttextr).

You will also need:

- Node.js
- An OpenAI API key

## Set up Langflow

Start up Langflow and choose to upload a flow (in the Projects section).

Upload the [Langflow JSON file](./langflow/Alt%20text%20generator.json). Open the flow and add your OpenAI API key to the Language Model component and then build the flow to ensure it's all working correctly.

## Running the app

Start by cloning the app from GitHub:

```
git clone https://github.com/philnash/alt-text-generator.git
cd alt-text-generator
```

Install the dependencies:

```
npm install
```

Copy the `.env.example` file to `.env`:

```
cp .env.example .env
```

Fill in the credentials in the `.env` file. You need:

- The URL where Langflow is running (this is `http://localhost:7860` by default)
- A Langflow API key (optional, if you have authentication set up for Langflow)
- The flow ID, which can be found by clicking the _Share_ button in the flow canvas, then API access. The flow ID is the string in the URL `http://localhost:7861/api/v1/run/FLOW_ID`
- The Chat Input ID, which can be found by clicking on the chat input component and then clicking the _Controls_ button. The ID is next to the **Chat Input** title

Start the application with:

```
npm run dev
```

## How does it work?

When you add an image to the page you can submit the form, this uses a [Next.js Server Function](https://nextjs.org/docs/app/getting-started/updating-data#what-are-server-functions) to upload the image and any other data to the server.

This is handled by the [`uploadImageAction`](./src/app/actions/upload.ts) which uses the [Langflow API client](https://npmjs.com/package/@datastax/langflow-client) to send the data to the Langflow API. First, the image is uploaded to the [files/v1 API endpoint](https://docs.langflow.org/api-files?utm_medium=referral&utm_source=devrel&utm_campaign=alttextr#upload-image-files-v1). Then, we run the flow using the [/run endpoint](https://docs.langflow.org/api-flows-run?utm_medium=referral&utm_source=devrel&utm_campaign=alttextr), passing the instructions as the chat input and using a [tweak](https://docs.langflow.org/concepts-publish?utm_medium=referral&utm_source=devrel&utm_campaign=alttextr#input-schema) to set the file path of the image we just uploaded.

The flow runs and returns the suggested alt text which is returned to the front end and the state is updated, rendering the suggestion.
