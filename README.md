# HelloWork

Making work as simple as a chat

## Install

- `cp .env.example .env`
- `npm install`
- `npm run dev`

## Features 

**We integrate directly into the chat two kind of features:**
- Chat command: Similar than discord, start with a slash, and launch a action that here will lead to action on chain
- Custom render and CTA: Message that include some specific text are parsed and render with a custom designe included call to action 
Both allow a really easy way for users to do handle there collaboration directly from the chat.

**These are the features:**
- Command to create a gig: `/create-service Audit SmartContract for 10 MATIC`
- Custom message to render a Gig and his metadata
- CTA to create automatically the proposal link to a gig
- CTA to send the fund to the escrow and validate the proposal
- Command to release fund for a given service: `/release #338 50%`

# Powered BY
### 🛠️ TalentLayer

TalentLayer is an open protocol and dev toolkit for hiring applications. You can use it to build platforms that leverage a unified decentralized backend for job posts, escrow, user profiles, and reputations.

#### Developer Resources

**Introduction:** [Read here.](https://docs.talentlayer.org/)

**Documentation:** [Read here.](https://docs.talentlayer.org/technical-guides)

**XMTP & TL:** [Read here.](https://docs.talentlayer.org/technical-guides/messaging/integrating-xmtp)

### 🗨 XMTP

XMTP is an open protocol and dev toolkit for messaging applications. You can use it to build peer-to-peer messaging 

#### Developer Resources

**Introduction:** [Read here.](https://xmtp.org/docs/dev-concepts/introduction)

**Documentation:** [Read here.](https://xmtp.org/docs/dev-concepts/start-building)

**Example DAPP Tutorial:** [Read here.](https://xmtp.org/docs/client-sdk/javascript/tutorials/build-an-xmtp-hello-world-app)