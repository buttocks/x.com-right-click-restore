# X.com Right Click Restore

A small Tampermonkey userscript that restores the browser's normal **right-click image menu** on X / Twitter.

Depending on your browser, the menu can include **Copy image**, **Save image as...**, **Open image in new tab**, and **Copy image address**.

## What v1.1 does

- Prevents X's custom photo right-click menu from replacing the browser's native menu on supported photos.
- On hovering a post photo, attempts to preload X's `name=orig` rendition and uses it so **Copy image** can get the highest resolution X hosts.
- Targets timeline photos and photos in X's viewer when their image elements are accessible.
- Leaves text, avatars, videos, and left-click behaviour alone.
- Does not bulk-download photos or send data to third parties.

**Important:** A low-resolution upload cannot be made sharper. `name=orig` asks X for its largest available version, not an AI-upscaled picture. If you right-click before the original has loaded, your browser may still copy a smaller rendition. Hover briefly first.

## Install

1. Install **Tampermonkey** in Chrome, Edge, Brave, or Firefox.
2. Download [X-Right-Click-Restore.user.js](X-Right-Click-Restore.user.js) (use the GitHub **Raw** button or download the file).
3. In Tampermonkey, open **Dashboard → Utilities → Import from file**.
4. Choose the `.user.js` file and confirm installation.
5. Refresh X.

## Known limitations

- X can change its page markup and event handling at any time.
- Elements overlaid on photos may still show a generic right-click menu instead of image-specific commands.
- Copy quality depends on whether the original image has finished loading before you right-click.
- Some original-resolution URLs are unavailable; the script leaves those photos unchanged.
- JavaScript syntax was checked, but this version has not been verified inside a signed-in X session.

## Privacy

Runs locally in your browser on `x.com` and `twitter.com`. No analytics or tracking. Image requests go directly to X's existing `pbs.twimg.com` image host.

## License

MIT.
