# SpeakGrid AAC

A free, iOS-compatible web app for custom AAC-style speaking buttons.

## Features

- Custom grid size from 1x1 through 8x8
- Editable button labels and spoken text
- Built-in emoji/symbol choices
- Uploaded photo support
- Direct image URL support for internet icons
- Select on first touch or select on release
- Message bar that combines selected phrases
- Speak individual buttons or the full message
- Saves your board locally in the browser with localStorage
- Works as a simple static website; no paid server or database required

## How to run locally

Open `index.html` in a browser.

## How to use on iPhone/iPad

1. Put these files on a static web host such as GitHub Pages, Netlify, Vercel, or AWS Amplify.
2. Open the hosted URL in Safari on iPhone/iPad.
3. Tap Share.
4. Tap Add to Home Screen.
5. Launch SpeakGrid from the Home Screen.

## Notes

This app uses the browser's built-in Web Speech API. On iOS, speech must be triggered by a direct user tap/touch, which is why the speaking buttons work best as direct interactions. Voice options depend on the device and browser.

Uploaded photos are stored locally in the browser. Large photos can make local storage fill up quickly, so crop/compress images first if needed.

This is not a medical device and is not a replacement for a commercial AAC system when dependable communication access is medically or educationally required.


## Update notes

- Board settings are hidden until **Edit board** is selected.

## Folder/page buttons

Buttons can now be set to either:

- Speak aloud the programmed spoken text
- Open a folder/page with its own AAC buttons

To create a folder button, choose **Edit board**, tap a button, set **Button action** to **Open folder/page**, then either link to an existing folder/page or enter a new folder/page name.

## Update: release-target selection

When Select on release is enabled and Edit mode is off, the app now activates the button under the finger at the moment the touch/pointer is released. This supports sliding from one button to another before choosing, while keeping page scrolling locked during normal board use.

## Latest update

Folder buttons can now be set to **Speak aloud + open folder/page**. This mode speaks the programmed spoken text first, adds it to the message window if enabled, and then opens the linked folder/page.


Version note: 2026-06-11 action dropdown fix. The Button action menu includes Speak aloud + open folder/page.


## Grid resizing and pagination update

- Changing to a larger grid preserves existing buttons and adds blank buttons to fill the visible grid.
- Changing to a smaller grid preserves all existing buttons and automatically creates numbered grid pages.
- Buttons are ordered left-to-right, top-to-bottom when split across smaller grid pages.
- In Edit Board mode, open a button and use **Move / swap placement** to swap it with a spot on another numbered grid page.
- The button grid uses the available screen space so smaller grids produce larger buttons.


## 2026-06-11 pagination slot-count fix
This version preserves a page's total slot count when reducing grid size, so a 4x4 board becomes four 2x2 grid pages instead of losing or hiding slots. It also includes cache-busted file references.

## 2026-06-12 profile export/import update

Profile transfer is local-only and file-based. In **Edit board → Profiles**, use:

- **Export current profile** to download one profile as a `.json` file.
- **Export all profiles** to download every profile on the current browser/device as a `.json` file.
- **Import profile JSON** on another device/browser to add or replace profiles from an exported file.

Exported JSON files include profile names, board layouts, folders/pages, button text, embedded uploaded images, and profile passcodes. Keep these files private if they contain sensitive photos, names, or passcodes.

## 2026-06-16 delete button + larger image layout update

- The button editor now has two removal options:
  - **Clear button content** empties the selected spot but keeps the grid placement.
  - **Delete button slot** removes the spot and shifts later buttons forward.
- Button images now scale to fill more of the button area while preserving a small label strip at the bottom.
- Uploaded photos and internet images resize responsively as grid size changes.


## 2026-06-16 default sample board update

New installs and **Reset sample board** now create this default structure:

- Home: 3 columns x 2 rows
- Snack: 3 columns x 3 rows
- Toys: 3 columns x 3 rows
- My words: 3 columns x 2 rows
- Occupational Therapy: 3 columns x 3 rows

Home includes Rest, Snack, Hug, Toys, My words, and Occupational Therapy. Snack/Toys/Occupational Therapy use Speak + Open Folder where requested; My words opens its folder without speaking first. Each page stores its own row/column layout.


## 2026-06-16 default board + Back navigation fix

- The bundled sample board is the requested Home/Snack/Toys/My words/Occupational Therapy structure.
- Folder buttons use S, F, and SF behavior as specified.
- Back now returns to the previously visited numbered grid page inside a multi-page folder before backing out of that folder.
