# NITROVA — GitHub Pages

Public automotive catalog at https://astraone11.github.io/. This repository is the static presentation layer of NITROVA. It includes interactive search, filters, detail dialogs, an image studio, and cinematic scroll effects. Authentication and Porsche favorites still run at https://nitrova-porsche.xboxsteam94.chatgpt.site/; links to them remain intact. GitHub Pages cannot run that server backend.

The homepage uses layered vehicle photography and H.264 film chapters on a warm ivory layout. GSAP ScrollTrigger drives reversible transforms; Lenis is limited to fine-pointer desktop devices. Mobile and tablet layouts share a 1024px breakpoint in CSS and motion code. Touch scrolling remains native. Reduced-motion users get a readable static layout and manual film controls. No GLB or WebGL scene is loaded by the current homepage.

The In Motion vehicle is contained in a normal-flow visual stage. Design uses an 6-second Porsche film (source `1000126738.mp4`, 00:48–00:54), with a 1280×720 desktop derivative and 854×480 mobile derivative. The poster comes from 00:48. Only the most visible video plays; offscreen videos pause. The gallery uses one bounded stage and a maximum of two visible layers during transitions. Short landscape viewports use direct gallery controls without pinning.

The original six Porsche entries remain. Nine additional image-led entries use the supplied Koenigsegg and BMW photos. Three Agera R entries are different visual treatments of one model, not three separate production models. The concept study is not identified as a production car. Unverified specifications show “Belum diverifikasi” rather than invented numbers. The interactive showroom pans and zooms the supplied images. No source image has been artificially upscaled to 4K.

Published specification references: [Koenigsegg Agera R](https://www.koenigsegg.com/model/agera-r), [BMW M4 Competition](https://www.bmw-m.com/en/all-models/overview-m-and-m-performance/bmw-m4-coupe/2024/bmw-m4-coupe-and-bmw-m4-competition-coupe.html), and [BMW i7 M70 xDrive](https://www.press.bmwgroup.com/latin-america-caribbean/article/detail/T0413600EN/the-bmw-i7-m70-xdrive?language=en). Figures can vary by market, year, tires, and optional equipment.

No credentials, server source, or database data are included.

`responsive-review.html` is a noindex QA page that previews the actual public homepage at defined viewport sizes. It is not linked from the main navigation and does not emulate physical-device performance. Use its chapter selector to check a section, then change the viewport to verify the shared compact breakpoint, heading fit, gallery height, and menu.
