> 
> 👷 **Note:** This project is still being imagined
> 

# A generative Ai and project management extension for Scratch 🤖🧩

<table width="100%">
  <tr>
    <td width="50%">
      <img src="https://user-images.githubusercontent.com/69949201/227663428-344514da-58b2-458d-8f23-26c24feddb38.png">
      <h3>Scratch Copilot</h3>
      <h4>(coming soon)
    </td>
    <td width="50%">
      <img src="https://user-images.githubusercontent.com/69949201/227657236-3ef7865d-b918-471e-8e76-43608b6971e6.gif">
      <h3>Integrate Ai models and web services</h3>
      <p>Generate images, backgrounds, and even code with new blocks that help you connect to web services and Ai models like ChatGPT and Stable Diffusion
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>Edit code with [scratchblocks]</h3>
      <!-- <p>View and edit blocks with the keyboard and easily copy+paste code -->
      <h4>(coming soon)
    </td>
    <td width="50%">
      <img src="https://user-images.githubusercontent.com/69949201/225105285-a059f73d-24bc-4e84-a5d9-39bd292c055c.png">
      <h3>Organize code across multiple projects</h3>
      <p>New Snapshots feature helps you manage multiple projects inside of just one. Comes with blocks to help you teleport and broadcast between them
    </td>
  </tr>
</table>

<br>
<br>
<br>
<hr>
<br>
<br>
<br>

## Coming soon
- New Snapshot Blocks to load snapshots with code
- Allow broadcasts to trigger blocks in other snapshots
- Add markdown notes to snapshots

<br>
<br>
<br>
<hr>
<br>
<br>
<br>

## Manage projects with `Snapshots`

### Use cases
- **Version control** - Bookmark milestones or maintain a living changelog
- **Interactive studios** - Each game can be saved to a different snapshot, then conditionally loaded
- **Level/map system** - Use cloud variables to move your variables snapshots in real time
- **Code organization** - Turn your snapshots into templates

(more details coming soon)

<br>
<br>
<br>
<hr>
<br>
<br>
<br>

## Local development
### Requirements
- [git](https://git-scm.com/download) - to clone the source code locally
- [NodeJS](https://nodejs.org/en/download/) - develop the extension locally

### Setup
```bash
# Open terminal somewhere and download this repository to it
git clone https://github.com/moarhaus/scratchmoar

# Change directories and install dependencies
cd scratchmoar
npm i

# From now on, just run this to start
# Live script: http://localhost:8000/dist/index.js
npm start
```

### Developing
- Visit any of these to develop the extension live:
  - Turbowarp: [https://turbowarp.org/editor/?extension=http://localhost:8000/src/index.js](https://turbowarp.org/editor/?extension=http://localhost:8000/src/index.js)
  - Scratchmoar Sandbox: [https://scratchmoar.netlify.app/editor.html?extension=http://localhost:8000/src/index.js](https://scratchmoar.netlify.app/editor.html?extension=http://localhost:8000/src/index.js)
  - See our fork of [scratch-gui](https://github.com/moarhaus/scratch-gui) for a fully offline solution

### Troubleshooting
- If you get any weirdness in the npm console, try clearing .parcel-cache
- Add `&reset` to URL to force clear everything incase you accidently corrupt IndexedDB while developing

### Notes
- Utilities, available in opcode callbacks: https://github.com/LLK/scratch-vm/blob/f405e59d01a8f9c0e3e986fb5276667a8a3c7d40/src/engine/block-utility.js
- Here's an example of core blocks: https://github.com/LLK/scratch-vm/blob/f405e59d01a8f9c0e3e986fb5276667a8a3c7d40/src/blocks/scratch3_control.js


<br>
<br>
<br>
<hr>
<br>
<br>
<br>
