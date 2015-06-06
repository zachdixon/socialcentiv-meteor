conversations = [
  {
    "id": 1,
    "relevance": null,
    "lbc_tweet": {
      "id": 1,
      "author_name": "Hi Mom :)",
      "author_screen_name": "OrderNTheeCourt",
      "author_avatar_url": "http://pbs.twimg.com/profile_images/603281750500868096/k1Wige2d_normal.jpg",
      "location": ", tx ",
      "message": "RT @Kbzoooo: This bitch courtney never hungry and shit.",
      "posted_at": "2015-06-01T15:29:21.000Z"
    },
    "reply_tweet": null,
    "status": "awaiting_reply"
  },
  {
    "id": 2,
    "relevance": null,
    "lbc_tweet": {
      "id": 2,
      "author_name": "LIZ",
      "author_screen_name": "NamboLiz",
      "author_avatar_url": "http://pbs.twimg.com/profile_images/604869421383835648/7vSi0IT8_normal.jpg",
      "location": "",
      "message": "RT @TorrestheMC: Im hungry",
      "posted_at": "2015-06-01T07:29:52.000Z"
    },
    "reply_tweet": null,
    "status": "awaiting_reply"
  },
  {
    "id": 3,
    "relevance": null,
    "lbc_tweet": {
      "id": 3,
      "author_name": "⠀",
      "author_screen_name": "_KFJR",
      "author_avatar_url": "http://pbs.twimg.com/profile_images/603347515304325120/lPY2KuJT_normal.jpg",
      "location": "you can hate me now",
      "message": "RT @TorrestheMC: Im hungry",
      "posted_at": "2015-06-01T07:23:06.000Z"
    },
    "reply_tweet": null,
    "status": "awaiting_reply"
  },
  {
    "id": 4,
    "relevance": null,
    "lbc_tweet": {
      "id": 4,
      "author_name": "Emelyne Garcia",
      "author_screen_name": "garcia_emelyne",
      "author_avatar_url": "http://pbs.twimg.com/profile_images/600893862509285376/GByFTU-X_normal.jpg",
      "location": "",
      "message": "RT @TorrestheMC: Im hungry",
      "posted_at": "2015-06-01T07:23:05.000Z"
    },
    "reply_tweet": null,
    "status": "awaiting_reply"
  },
  {
    "id": 5,
    "relevance": null,
    "lbc_tweet": {
      "id": 5,
      "author_name": "lil nattt ",
      "author_screen_name": "natalyyy_3",
      "author_avatar_url": "http://pbs.twimg.com/profile_images/602363544009474049/YmlI0PhJ_normal.jpg",
      "location": "",
      "message": "RT @TorrestheMC: Im hungry",
      "posted_at": "2015-06-01T07:18:15.000Z"
    },
    "reply_tweet": null,
    "status": "awaiting_reply"
  },
  {
    "id": 6,
    "relevance": null,
    "lbc_tweet": {
      "id": 6,
      "author_name": "cristian.",
      "author_screen_name": "TorrestheMC",
      "author_avatar_url": "http://pbs.twimg.com/profile_images/603401703308730368/O6_EV0rV_normal.jpg",
      "location": "dallas, tx #MFFL",
      "message": "Im hungry",
      "posted_at": "2015-06-01T07:17:52.000Z"
    },
    "reply_tweet": null,
    "status": "awaiting_reply"
  },
  {
    "id": 7,
    "relevance": null,
    "lbc_tweet": {
      "id": 7,
      "author_name": "Jamɪe",
      "author_screen_name": "sackopenguins",
      "author_avatar_url": "http://pbs.twimg.com/profile_images/605236065448787968/trT6V_GK_normal.jpg",
      "location": "",
      "message": "Courtney: \"Man.. This second hand weed smoke is making me hungry.\"\rMe: \"I dont think that's how it works...\"\rCourtney: \"I NEED A PRETZEL\"",
      "posted_at": "2015-06-01T01:35:53.000Z"
    },
    "reply_tweet": null,
    "status": "awaiting_reply"
  },
  {
    "id": 8,
    "relevance": null,
    "lbc_tweet": {
      "id": 8,
      "author_name": "SARA GALAVIZ",
      "author_screen_name": "sarita109",
      "author_avatar_url": "http://pbs.twimg.com/profile_images/596941252207071233/vGYAHCLE_normal.jpg",
      "location": "Garland, TX",
      "message": "After a good family time walking at Trinity River Greenbelt Park, we got hungry, and the best remedy… https://t.co/eogTOzs5J2",
      "posted_at": "2015-06-01T01:21:05.000Z"
    },
    "reply_tweet": null,
    "status": "awaiting_reply"
  },
  {
    "id": 9,
    "relevance": null,
    "lbc_tweet": {
      "id": 9,
      "author_name": "Jared",
      "author_screen_name": "JaredBBC",
      "author_avatar_url": "http://pbs.twimg.com/profile_images/558445463838273536/wuYFZTnw_normal.jpeg",
      "location": "Juris Doctor",
      "message": "Having a good conversation with God, speaking with @riqknows this morning and hearing how hungry the… https://t.co/USqRgoV2BN",
      "posted_at": "2015-06-01T00:31:06.000Z"
    },
    "reply_tweet": null,
    "status": "awaiting_reply"
  },
  {
    "id": 10,
    "relevance": null,
    "lbc_tweet": {
      "id": 10,
      "author_name": "June 15th",
      "author_screen_name": "JonKendrick_",
      "author_avatar_url": "http://pbs.twimg.com/profile_images/600440627885649920/HgBghjkd_normal.jpg",
      "location": "Miami, FL",
      "message": "I am so hungry",
      "posted_at": "2015-05-31T19:48:57.000Z"
    },
    "reply_tweet": null,
    "status": "awaiting_reply"
  }
]



Template.conversationsList.helpers
  'conversations': ->
    conversations

Template.conversation.helpers
  timeFromNow: ->
    moment(@posted_at)?.fromNow(true)
  location: ->
    @location or "N/A"


