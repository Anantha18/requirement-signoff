# What I Did Today

Date: 29 August 2026

## 1. What we built

We built a public Room BOM Planner for people planning a video-conferencing room. A visitor enters the room size, number of seats, meeting style, email, company and phone number, then receives an indicative equipment list and budget range in Indian rupees. The recommended display size follows Epson's presentation-viewing rule, and every completed estimate is saved so I can see evidence of real use.

Live website: https://av-room-configurator.vercel.app

Public project files: https://github.com/Anantha18/requirement-signoff

## 2. What every tool is for

- **Homebrew:** A tool installer for a Mac; it installs and updates command-line programs without making me download each one manually.
- **Node.js:** The program that runs the website-building tools on my computer and on Vercel.
- **npm:** The package installer included with Node.js; it downloads the ready-made code libraries the project needs and runs commands such as tests and builds.
- **Git:** A change-history tool on my computer; it records snapshots so I can see, share or recover earlier versions.
- **GitHub:** The online home for the Git history and project files; it gives the event a public repository it can inspect.
- **Convex:** The online database and server logic; it validates and saves each visitor's form details and generated room estimate.
- **Vercel:** The hosting service; it turns the project files into the public website people can open in a browser.
- **Codex:** The coding assistant that read my instructions, edited files, ran checks, found problems, deployed the website and explained the results.
- **Next.js:** The website framework, meaning the prepared structure used to build the page with React.
- **React:** The page-building library that updates the result on the same screen after the visitor submits the form.
- **TypeScript:** JavaScript with extra checks; it catches mismatched data before the website is published.
- **Skills:** Extra written instructions installed for Codex; they guided React quality, interface design, planning, Convex and Vercel work.

## 3. What we did, in order

1. **I described my work and pain.** I told Codex that I sell video-conferencing solutions and spend time discovering client needs, preparing a BOM (Bill of Materials, meaning the equipment list) and understanding budgets. This made the idea come from a problem I personally know.

2. **I named three reachable users.** I said I have three confidential clients I can reach by phone, WhatsApp or email. This proved I could test the product with real people instead of building only from assumptions.

3. **I described my current process and assets.** I explained that I use a site-survey document, Xten for BOM preparation and verbal budget questions, and that I have a sample survey and tentative pricing catalogue. This showed what the product could shorten and what material could be reused.

4. **I set my time and risk limits.** I gave the hours available, chose medium risk and kept payment outside this build. This stopped the first version from becoming too large for one weekend.

5. **We chose client discovery and BOM selection.** We narrowed the idea to one room and one quick configuration flow. This gave us a complete job that could work by Sunday instead of a large AV design platform.

6. **I sent an eight-question test to a client on WhatsApp.** The client completed it in about two to five minutes. This was a no-code test, meaning we checked the idea manually before spending time building software.

7. **We learned where the questions were weak.** Questions 4 and 7 needed explanation, especially why two displays might be required and why a ceiling microphone could change the cost. We recorded this because real confusion is more useful than our guesses.

8. **We wrote the build scope.** Codex created `IDEA_SCOPE.md`, the control document that says what is included, what is excluded, how success is proved and what to cut if time runs short. This kept the build focused.

9. **We prepared the computer and project.** The required command-line tools, coding skills and Builder Pulse connection were set up, then a Next.js project was created in the `requirement-signoff` folder. The empty starting page proved the basic software setup worked.

10. **We created the online services.** The project was connected to GitHub for public source files, Convex for saved data and Vercel for the live website. This produced the first public shell, meaning an empty but working version of the site.

11. **We defined what Convex should save.** We added database tables, meaning organised groups of saved records, for room configurations and first-use events. We also added validation, meaning checks that reject bad email addresses, impossible room sizes, invalid seat counts and malformed phone numbers.

12. **We replaced the coming-soon page.** The page became one form containing room length, room width, seats, Native or BYOD, and email. “Native” means the room starts calls from its own controller; “BYOD” means the visitor connects a laptop.

13. **We added the BOM rules.** Small, medium and large room rules now choose display, video, audio, control, connection and installation items. The prices are broad planning ranges, not customer quotations.

14. **We showed the result on the same page.** After submission, the visitor sees item name, category, quantity, item price range and total budget band. The same action also saves the form and result in Convex.

15. **We tested the code.** Codex ran `npm test`, which checks expected room results automatically; `npm run lint`, which checks for unsafe or inconsistent code; and `npm run build`, which creates the same production version Vercel will host. Five automated tests passed, the code check had no errors and the production build completed.

16. **We checked the page visually.** Codex opened screenshots at desktop and phone sizes and corrected horizontal clipping, meaning content extending beyond the right edge of the phone screen. This caught a problem that code tests could not see.

17. **We deployed the working product.** Codex ran the Convex deployment and then the Vercel production deployment. A production deployment means the version intended for real visitors, not just the copy running on my computer.

18. **We tested a real saved estimate.** A 20 × 14 foot, 10-seat Native room saved successfully and returned a medium-room BOM. Test records were labelled as tests and must not be counted as real users.

19. **We changed the public address.** `room-configurator.vercel.app` was already owned by someone else, so I approved `av-room-configurator.vercel.app`. Codex assigned it, updated the scope and confirmed that it returned a successful web response.

20. **I requested company and phone fields.** We added optional Company name and Contact number fields because a visitor may want to share lead details without being blocked from receiving an estimate.

21. **We verified Epson's display rule.** Codex inspected Epson's official 4/6/8 Rule Simulator. For presentations, the farthest viewer should be no more than six times the image's vertical height, so the planner uses the room length as a conservative farthest distance, converts that height into Epson's 16:10 diagonal and rounds upward to the next five-inch size.

22. **We published and verified the final version.** A production test with company and phone data saved successfully, and a 20-foot room produced an 80-inch display recommendation. The finished changes were recorded with Git and pushed to GitHub.

## 4. What went wrong and how we fixed it

- **The first configurator test failed because no configurator existed.** This was intentional: we wrote the expected behaviour first, then added the calculation until the test passed.
- **The first calculation function accepted four separate values, but the tests sent one room record.** We changed the function to accept one room record, which is harder to mix up and easier to extend.
- **The production build rejected three CSS selectors.** CSS is the styling language; Next.js required those table styles to be tied to this page, so we added the page-specific class to the selectors.
- **The phone view extended past the right edge.** We constrained the page, form and long footer text to the phone width and stacked the form fields vertically.
- **The preferred address was unavailable.** `room-configurator.vercel.app` was already in use, so we chose and verified `av-room-configurator.vercel.app`.
- **The custom address did not automatically follow every new deployment.** After later deployments, we pointed the custom address at the newest production version again.
- **The Epson page did not reveal its rule through normal page reading.** We inspected the official simulator's own page and calculation file, found the 4×, 6× and 8× rules, and used 6× because this product is designed mainly for presentations.
- **The original fixed display sizes did not follow room depth.** We replaced them with a tested formula and made the BOM's display line use the calculated size.
- **Changing the database could have broken older saved records.** The new company, phone and display-size fields were made optional in stored records, so records saved before this change remain valid.
- **Automated test records could look like real users.** We used clearly labelled test email and company values and recorded that they must not be included in Build Week signup numbers.

## 5. From a new idea to a live public URL

- [ ] Describe one painful job I personally do and the one result the product must deliver.
- [ ] Name three real people I can ask to use it.
- [ ] Test the riskiest assumption manually for 30 minutes before writing code.
- [ ] Write a short scope: one user, one action, one result and a list of things not being built.
- [ ] Install Homebrew if needed, then use it to install Git and Node.js.
- [ ] Create an empty project folder and open it in Codex.
- [ ] Create the website with Next.js and run it on my computer with `npm run dev`.
- [ ] Create a Git history with `git init`, save the first snapshot with `git commit` and push it to a public GitHub repository.
- [ ] Create a Convex project, define exactly what must be saved and connect the website to it.
- [ ] Create a Vercel project and publish the empty page immediately, so setup problems appear early.
- [ ] Build one complete flow from input to useful result before adding polish or extra features.
- [ ] Add automatic tests for the important calculation and bad inputs.
- [ ] Run `npm test`, `npm run lint` and `npm run build`; fix every error before publishing.
- [ ] Check the live page logged out, on a phone and on another device if available.
- [ ] Submit one clearly labelled test entry and confirm it appears in Convex.
- [ ] Ask three real users to try it, watch where they stop and fix that point first.
- [ ] Record the change with Git, push it to GitHub and deploy the verified version to Vercel.
- [ ] Save screenshots of the live product and real usage numbers; never count my own test entries as users.

## Tomorrow's first action

Compare the indicative equipment price bands with the tentative pricing catalogue, then adjust any large mismatch before sending the link to the first three clients.
