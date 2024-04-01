**Robbie Wagner:** [00:09] What's going on, everybody? Welcome to another Whiskey Web and Whatnot. With myself, Robert William Wagner, and my co-host as Charles William Carpenter III.

**Chuck Carpenter:** [00:22] Nobody calls me that.

**Robbie Wagner:** [00:23] Yes, they do. I do. Anyway.

**Chuck Carpenter:** [00:28] I just wanted to do that first. Boop.

**Robbie Wagner:** [00:30] Oh, stealing thunder there. Yeah. So our guest today is Jason Lengstorf from Learn with Jason. What's going on, Jason?

**Jason Lengstorf:** [00:38] It's great. I'm doing great. I'm very happy to be here. I'm excited for this for this format. It's a little different.

**Robbie Wagner:** [00:44] Yeah.

**Chuck Carpenter:** [00:45] It's what we shoot for, basically. Different. Different is good, different is bad. We don't know, but we definitely cover different.

**Robbie Wagner:** [00:50] Yeah, it's like Apple's that think different, right? Anyway, Jason, if you want to give a brief intro into who you are and what you do for the folks at home.

**Jason Lengstorf:** [01:01] Sure. I am Jason Lengstorf. I host a show called Learn with Jason, which is a weekly peer programming show. I bring somebody from the community on who's an expert, and they teach me a thing that they are an expert in. It's about 90 minutes live peer programming. Super fun. And then I also live stream on my own on Tuesdays for a few hours. And then, on top of that, I help companies with making better media. So I'm kind of a consultant for going out and creating better video and other types of outreach to reach developer audiences more effectively.

**Robbie Wagner:** [01:37] Nice. Do you do consulting on backgrounds? Can we get some help with our lighting and the thing behind us?

**Jason Lengstorf:** [01:44] I can, but I'll be honest, it's just going to be a list of YouTube videos that I watched.

**Chuck Carpenter:** [01:48] Oh, that's perfect.

**Robbie Wagner:** [01:49] Fair.

**Chuck Carpenter:** [01:50] I'll pay $50 for that. I'll send you another bottle of whiskey for that. How about that? Perfect. No, we'll barter. Awesome. Yeah. I mean, kudos to you. Especially, like, the Tuesday live coding thing. I feel like I am garbage anytime someone is watching me type. And I couldn't imagine for hours having to delete, retype, delete, and retype, like, half of what I do. I've definitely watched some of your videos, and I'm impressed how you just keep rolling through it. And even if you need to do a little of that, you're really like talking through the steps you're taking, the choices you're making, looking and responding to feedback in the chat stream and stuff. And I was like, good for you.

**Jason Lengstorf:** [02:29] Yeah, it's a lot, but I have a really good time with it. A lot of it comes from just repetition, though, right? So I, early on in my career, was a musician, and I was the frontman of a band. So I spent a lot of time, like, being up in front of people. I was in an emo band, so I was wearing, you know, tight pants and a white belt, and I had my eyeliner on, and I was trying to dance. And I'm used to looking foolish in front of people is I guess, what I'm trying to say. So now when I'm doing it with code, until recently, because I just got a new keyboard, and it's one of those nonstandard keyboard layouts. I got an ErgoDox EZ, and it moved my space bar and my delete key and stuff. So now I'm really struggling on the live coding because my typing speed is like half of what it used to be, and I keep miss typing things. That's hard.

**Chuck Carpenter:** [003:17] Yeah, for sure.

**Jason Lengstorf:** [03:18] I can't really imagine any other way that I'd want to do this job because whenever I've tried to do stuff pre-prepped, I'll spend so much time practicing, and you get everything like, oh yeah, it's going exactly right. And then, as soon as you get in front of a crowd, one small thing goes wrong, and then you're completely off the rail. So treating it more like improv and knowing that everything's going to go wrong and just being ready to laugh about it and roll into your fix as opposed to getting flustered because it didn't work is a survival tactic.

**Chuck Carpenter:** [03:48] Yeah, exactly. Okay, wave of the hand over here. But I think that's an excellent correlation. I hadn't really considered that. If you mentally prepare yourself in more of an improv kind of thing and off the script is totally fine, then you don't get flustered. Really? In that same way.

**Jason Lengstorf:** [04:04] Yeah, as opposed to trying to go verbatim, you're trying to go with bullet points. You have like three things you're trying to get done, and if you run out of time, it's okay if you only get the first two. But otherwise, you're kind of making it up as you go along. And that tends to take a lot of the stress off because you've got natural stopping points, and you don't have things you exactly have to say. You just want to get in that vicinity. I'm trying to show this concept, not say exactly these words, and it makes it a little less high-stress to go on because you're not performing anymore. You're just hanging out with people, trying to show them something. It's like if you're at a meet-up and people crowded around your computer while you showed off something you were working on. It feels more like that and less like a stage performance.

**Chuck Carpenter:** [04:45] Yeah, and more fun, I would imagine.

**Jason Lengstorf:** [04:46] I have a whole lot more fun because you're just joking around with a bunch of devs in a chat window, which is, I feel like that's the most fun part of any day job anyways, is screwing around in the chat.

**Chuck Carpenter:** [04:57] For sure. Everybody can see my slack chats. That would be interesting. But before we continue to go down that path, we'll definitely circle back to it, I'm sure, in a couple of different points. But let's get to the whiskey, the actual fun part of being here.

**Jason Lengstorf:** [05:13] Let's do it.

**Chuck Carpenter:** [05:14] Today we are having a Heaven Hill Bottled-in-Bond 7-year straight bourbon. So it is. Where is that? 100 proof. That's what bottled-in-bond always means. It is, as I mentioned, age seven years. It has a mash bill of 78% corn, which is pretty significant for bourbon. 12% malted barley and 10% rye. So it should be interesting. So this is like bourbon from the OG Bardstown main area. It's not in Bourbon County, actually, but it's where a lot of, like, the original distilleries are.

**Robbie Wagner:** [05:48] Smells like bourbon.

**Jason Lengstorf:** [05:53] Oh, yeah. I got to do it right on the mic, right?

**Chuck Carpenter:** [05:54] Sure, why not? There it is. Yeah, we don't add sound effects. That actually is just getting as close as possible, I guess. So this place is a pretty cool story. They kicked off right after Prohibition. Some retail brothers bought into the distillery and just started trying to make better stuff. And they've been doing pretty well since I guess.

**Jason Lengstorf:** [06:17] Yeah. I did a bourbon tour a while back with a friend of mine where we went to several distillers, including we went through Heaven Hill in Bardstown, and it was super cool to see. Also super weird to find out that just about every whiskey label now is under Buffalo Trace. We went to the Buffalo Trace Distillery thinking we were going to see, like, Buffalo Trace. And I was like, oh, my God, there are like 40 labels here.

**Chuck Carpenter:** [06:42] Yeah, exactly. Like all the stuff that's really hard to get, like all the Weller things. And obviously, Pappy is another distillate of theirs and Sazerac Rye, like, so many things. Actually, Heaven Hill has a decent number of labels under their stuff, too. They have rick houses all over the place, and they're doing, like, the Ezra Brooks and the Evan Williams stuff. This yeah, just a ton of things. It's cool. You got to go there.

**Jason Lengstorf:** [07:08] The thing that really confused me was when I realized that different whiskey labels were the same whiskey at different ages. Like, I didn't know, like, Pappy Van Winkle is if you pull it out of the barrel earlier, it becomes which one is it?

**Chuck Carpenter:** [07:24] Weller.

**Jason Lengstorf:** [07:25] Yeah, right. So it's the same whiskey. It's just like it been in the barrel a little bit less time, which is fascinating.

**Robbie Wagner:** [07:30] Just 20 times more expensive.

**Jason Lengstorf:** [07:32] 20 times more expensive. And the other thing that was fun is when I was in Kentucky, this was right around this time. Did you all hear about the Pappy Van Winkle heist?

**Chuck Carpenter:** [07:41] Yup.

**Jason Lengstorf:**[07:42] Like a legit, like old-timey heist. Busted into a warehouse, just roll into the warehouse, and stole half the remaining inventory of Pappy Van Winkle. Which is one of the reasons why if you go try to buy a bottle now, it's like $3,000 on the aftermarket or something.

**Chuck Carpenter:** [07:57] Yeah, if you're lucky.

**Jason Lengstorf:** [07:58] But this was before or right during the time when Pappy was becoming, like, very, very high demand. So we found Pappy Van Winkle twelve year, which I think was the most expensive one that we had found. It was one of the really high-dollar ones, and it was only $40 a pour.

**Chuck Carpenter:** [08:18] Nice.

**Jason Lengstorf:** [08:19]In Kentucky. So we were like, oh, yeah, we're having that, please. I think it's $130 a poor now when I find it.

**Chuck Carpenter:** [08:26] Yeah, well, I was going to say you're in Portland, so you suffer. Anyone west in the Mississippi is going to have just a harder time finding a lot of stuff. Just the distributors out here aren't as much. I'm actually from Kentucky, so I got some connections there. Back in 2007 was, I think, the first time I tried Pappy, and I got to try the 15 and the 20 for, like, $25 a pour. It was crazy. It's a different world.

**Jason Lengstorf:** [08:50] Maybe the most upsetting story I have is that a friend of mine got a bottle of Pappy Van Winkle 20 year just off the shelf in a local liquor store in Whitefish, Montana, for, like, $120 or something, because nobody in Montana knew about it, and they didn't care. So the price was so much lower, which because it was a lower price, he got it, and we drank it fast and then realized what it was actually worth.

**Chuck Carpenter:** [09:15] Oh, man. Oh, man. That's funny. But, you know, I don't know. It that's a two-edged sword because, to one degree, like, the secondary market has turned these things into trophies. And, like, isn't the fun of whiskey drinking it? I don't know. You got a shot at it at a normal price rather than paying that much for one dram.

**Jason Lengstorf:** [09:38] Yeah.

**Chuck Carpenter:** [09:40] What about this whiskey? I was starting to smell it first a little bit. I got a lot of caramel, actually, on the initial smells and then a slight floral after.

**Robbie Wagner:** [09:50] Yeah, it's a little floral and fresh. It's like a Febreeze air mist or something.

**Chuck Carpenter:** [09:57] Less like less chemically, though, possibly, like maybe like an actual spring.

**Robbie Wagner:**[10:02] Something you would put in your body.

**Chuck Carpenter:** [10:04] Yeah.

**Jason Lengstorf:** [10:05] What I'm finding pretty remarkable about this one is that for something bottled in bond, it doesn't have that sinus-clearing heat that you get off a lot of the high-proof stuff.

**Chuck Carpenter:** [10:14] Yeah, no, it definitely has a low hug rate, but enough to let you know it's there. So it's not bad. But I thought with the high corn, it was going to be too sweet, and it definitely isn't. And I think the rye has rounded it out a little, or the high proof has taken some of that down.

**Jason Lengstorf:** [10:33] I think this is one of the things that's been really interesting to me is I remember when I was younger, I thought about the proof as being, like, the most important part, where you're like, oh, well, we're going to a party. We need the Bacardi 151.

**Chuck Carpenter:** [10:45] Right.

**Jason Lengstorf:** [10:45] The highest proof thing we could get. And then, as I started buying whiskey, I kind of thought the same thing. I was like, oh, well, the overproof whiskey is the better whiskey. And I've started to realize it's more of like if you're making a sweet drink, you want an overproof whiskey to cut the sweetness of the drink. If you have a drink that's not very sweet and you put an overproof whiskey in it, it's just going to taste like booze. So you want the more calmed-down whiskey. So it's been really interesting to learn, I don't know, the thing that everybody learns, I imagine, which is moderation, everything's got a purpose. There's no right or wrong way to do this thing. But there's certainly like what I like about this is that a lot of times, overproof bourbons feel very much like they are intended to be mixed. Like it's there with the extra booze to stand up to the sugar in an Old Fashioned or to stand up to the Vermouth when you put it in a Boulevardier. But this one, because I think of the high corn, is actually really drinkable on its own.

**Chuck Carpenter:** [11:48] Yeah, I think those are excellent points, and some things around cocktail mixing because I don't do a ton of cocktails, but I do love some of the ones you mentioned, like Boulevardier. Like, I love Negronis in the summer and Boulevardier in the winter. And, like, I can see this making a lot of sense there in that. And yeah, I guess that does make a lot of sense in terms of putting the right proof in your cocktail based on some of the other complementary ingredients and times where you might scale up and down. I think that's good advice and feedback around this one, but, yeah, I do think it's very sippable on its own. It's decent. It's not stand out to me, but it's good. I kind of feel like that. So, Jason, I know you've probably listened to every single episode of the show, so you're very familiar, but for those who aren't, we do this semiformal rating system. It's one to eight tentacles, one being the worst stuff you've ever had, eight being the best stuff you've ever had. And obviously, four is just like in the middle. Not a big deal, not necessarily bad or good. Robbie and I, because we've been doing this for a few episodes, we tend to categorize them together. So we'll say, based on other bourbons, we've tried, but we don't care how. You can do that however you'd like.

**Jason Lengstorf:** [12:58] Why tentacles?

**Chuck Carpenter:** [12:59] Because our consultancy's Logo is a mythical octopus-like character, almost Cthulhu-like, you could say yes.

**Robbie Wagner:** [13:11] Kind of.

**Jason Lengstorf:** [13:12] So whenever somebody hires you, they're summoning the Cthulhu.

**Chuck Carpenter:** [13:14] Yes, exactly. I mean, in some ways, they pay money for that. I'm not sure why, but still keeps happening.

**Jason Lengstorf:** [13:21] I think I would probably rate this. It's on a one to eight, you said? Yeah, I would put this at a solid six. Like, this is something that I would happily grab off of my bar and sip. It's something that I would not feel terrible mixing. I think if it was an eight, like, I would never mix it with anything. You just want to drink it on its own. But this one, I think, would be a good mixer. It's a good sipper. It's one that I would bring out for friends. It's not like a special occasion whiskey. I would say this is good every day.

**Chuck Carpenter:** [13:48] Yeah. And some of my consideration around that, too, is how good, what is the quality, how good is it, how much would I come back to? It also, like, value for money, in a way. I think this one maybe was 60 or 65. I don't know in that range. And at that price point, I pick it up again. I feel free to, like, have it on a weeknight and not feel bad, that kind of thing. And if I had to mix it with something, that wouldn't feel bad too, because $80 bottle, $100 bottle, you start to feel like, I don't want to put this in with other things because it's just a little pricier and I don't want to use it so fast. So I was actually feeling a six, too as well. So I'm going to go with that.

**Robbie Wagner:** [14:23] Yeah, I'll say a six as well. Just for consistency. I was maybe thinking more like five-ish, but I'd say six. Six is good.

**Chuck Carpenter:** [14:32] Why can't you be a rebel? Just have your own thoughts.

**Robbie Wagner: **[14:34] I just can't do it. I let other people think for me.

**Chuck Carpenter:** [14:37] Fair enough.

**Chuck Carpenter:** [14:39] So, yeah, anyway.

**Jason Lengstorf:** [14:40] It does round out the Cthulhu with a triple six. Like, we're staying on brand here.

**Chuck Carpenter:** [14:46] Yeah, that's true. We took you somewhere with that one.

**Jason Lengstorf:** [14:49] Are we helping or hurting your business right now?

**Chuck Carpenter:** [14:53] I think it depends on some people's personal beliefs and their association with demonic beasts. Possibly. Post-COVID, I don't know. Could it get any worse? I'm just kidding. So a few more professional hot takes that we are going to talk about, especially in association while having whiskey. Hopefully, it'll get funnier. So you're an avid participant in the thing that is Twitter. Tech Twitter, and I'm sure you've seen a number of these discussions. I've seen some feedback, even from yourself. So here's the thing. How do you feel about Tailwind? Is Tailwind okay, or do you have to use vanilla CSS?

**Jason Lengstorf:** [15:34] You should use whatever you can convince your whole team to use. A lot of the discussion about which tool is right or wrong is sort of missing the forest for the trees. I think that if you are arguing for a tool for the sake of the tool, you've been misled. I think it's much more about you're arguing for a tool for the situation that the tool will enhance. And if I'm working on a project by myself, I'm not going to reach for Tailwind. It feels like a lot of ceremony. It feels like a lot of setting things up that I can code myself, and for maintainability, I know my style of CSS. If I am working with a small team, and all of those people are CSS experts. I'm probably not reaching for Tailwind. If I'm working with a small team and none of them are CSS experts, I'm probably reaching for Tailwind. It depends on how much flexibility do people want. I would say it's sort of the same as would you reach for a visual site builder or a bespoke JavaScript framework? Depends on how well everybody knows JavaScript, right? Like, if you've got a team full of marketers who have never written code in their lives, handing them a React site is a terrible idea.

**Chuck Carpenter:** [16:42] Yeah.

**Jason Lengstorf:** [16:43] And I think that the same kind of follows with any tool. If you've got a group of people who have an expertise or a lack of expertise, then the tools you choose should be polyfilling for where they're at and allowing them to use their strengths. But Tailwind or BEM or any CSS organizational tool is exactly that. It's an organizational tool. And if you're using it because you think it makes you better at CSS, maybe it makes you better at CSS, but it doesn't make everybody better at CSS. Like, your skill is your skill. If you become a Tailwind expert, you're a Tailwind expert. If you're a CSS expert, you're a CSS expert. Both of us can build a website. We can probably both build an identical website. And if I've practiced CSS my whole life, I'll be faster with CSS than Tailwind and vice versa, and so I think the argument that any tool is right or wrong is sort of missing the broader point of, like, why do tools exist in the first place?

**Chuck Carpenter:** [17:36] I think that's spoken.

**Robbie Wagner:** [17:37] Very well said.

**Chuck Carpenter:** [17:38] Yes. Your experience in developer relations is bleeding through in that response, in my view. I'm like, this is, yeah, I remember I used to get emails from this guy when he was in Netlify. Yeah, this is the voice I'm hearing now. I think that's diplomatic and correct. I think we've always said it as a community to a degree, unless you're, like, didactic about a particular framework or something because maybe you're a contributor to it. Outside of that, it's always, like, the best tool for the job. Right. And there's so many inputs into that decision, and even if it is the best tool for the job, but half your team is adamantly against it. Is that the fight you want to have? I mean, it's for this for the same visual output for your users?

**Jason Lengstorf:** [18:23] Right.

**Chuck Carpenter:** [18:23] Let's decide what hill you're going to die on.

**Jason Lengstorf:** [18:25] And there's a point where it's a good idea to make what is perhaps an objectively terrible decision because it's the right decision for the team. I'll give you an example. When I was at IBM, we worked on the IBM Cloud Dashboard, which was a few dozen teams working on all this together. And when IBM first started moving more toward front end, they sort of said, use whatever tool you want to for the job. So parts of IBM cloud were built in Angular, parts in Vue, parts in React, parts in Backbone, parts in jQuery. And that wasn't necessarily a bad thing. Like they were a microservices architecture. Everybody was sort of building things the way that they built them. As they started to scale, they started to see the seams and where that was an issue. So they wanted to normalize, they wanted a design system, and they wanted to start enforcing some uniformity across the site. And so the first instinct was we're going to standardize on I think React was the prevailing like whoever the architect was at the time was like, we're going to do React. So they were trying to push everybody to React. And what they were finding is everybody was doing it wrong. And a lot of it was because if you take a Vue developer who's never written React and you say, go, you're switching to React today. First of all, they don't want to. You've now forced them to leave the tool. They like to use a tool they don't. So they have no incentive to learn. They're not here by choice. They're here by force. So they're adversarial with the tools you're giving them. They don't want to use them. They want to misuse them. They want to make your life hard because they're mad that you made them use the tool they didn't want. And we saw that start to happen across the company. And so then they switched, and they made a choice, which I think every design system person I've talked to would say, this is the worst choice you can make. But they started building the design system in all languages. There was a vanilla version, a Vue version, an Angular version, and a React version of the design system. And it was a huge amount of work. It was an absolutely brutal maintenance workload. But it got the whole company to adopt the design system and in a way that they were willing to do. So the objectively bad choice for a design system was the objectively correct choice for the company and for the team, like the team structure that we were in. And I don't know how it's evolved over time, but I imagine what happened is they sort of brought everybody together on a design system and started to abstract away some of the things that didn't need to matter at all. So that people didn't even realize they were moving toward Angular or React, or Vue. They were just using the design system. So all that being said, the only way that you can really use a tool wrong is if you're basically dragging people kicking and screaming against their will into using a tool. Because you're just setting yourself up for failure if you slap everybody in the face with a tool and say, you must use this or else. They're going to find ways to break it out of spite. You got to bring people with you. And a lot of times, finding the tools that people are willing to use. Even if those tools aren't as objectively awesome as whatever tool you're excited about, you're going to get better results in the long run. And you're? Going to get people who actually adopt and choose the tool instead of you fighting this constant battle of having to be in every PR review to remind people, oh, you can't do it like that. That's not the React way or whatever it is that you're trying to do.

**Robbie Wagner:** [21:31] Or just use Astro, and everyone can use every framework done.

**Jason Lengstorf:** [21:37] I mean, there is that.

**Chuck Carpenter:** [21:42] That's the micro front.

**Jason Lengstorf:** [21:42] Might be another one of those, like, yeah, the micro front ends.

**Chuck Carpenter:** [21:46] That's it. That's the micro front ends. That's the key. That's where you can unify on Astro.

**Robbie Wagner:** [21:51] We call them islands now, I think.

**Jason Lengstorf:** [21:53] You can call them whatever you want. I'm actually really interested because I'm waiting for somebody to do that where they actually ship an Astro site at a massive scale that's got all of the frameworks in it, and then we're going to see the inevitable retraction. It's like, oh, not like that. One of the things that I think is really powerful about Astro is that it gives you the ability to get everybody on one platform to start because I think the hardest part in large team anything is the incremental migration story. How do you get people to start to move together? Because you never get permission to just grind the company to a halt for three months while you rebuild everything.

**Chuck Carpenter:** [22:33] Right.

**Jason Lengstorf:** [22:33] You're never going to get that permission, and even if you did, you're not going to get it done in three months. So how do you incrementally move people to a better system? How do you slowly nudge people toward where you want them to be? And I think that a lot of that comes down to finding a tool that lets everybody work together, but in ways that fit their current style. And that's something that I find really interesting about Astro that hasn't really been addressed in other platforms. So, yeah, I think if anybody's got a shot at making a big play on the enterprise web-building space, Astro has actually got a really interesting incremental adoption story that's not there for other tools.

**Chuck Carpenter:** [23:07] Which is highly ironic for me, because when I was introduced to Astro just in passing initially, before even, like, trying it myself, I thought, like, okay, I mean, this speaks to the static site generator story plenty to me, and you can sprinkle in some interactivity as needed. Brochureware will run away with this, and it's way less complex than, like, Gatsby or whatever else unless you kind of bring your own framework for the most part. So those are all good, compelling stories, but the fact that it's, like, evolved to a more complex tool set has been sort of like really surprising. And they're kind of the Trojan horse around that because I definitely thought even like a year ago that Next was going to, like, take that mantle up with them snapping up a bunch of talent and was like, when are we going to get Svelte as a view layer? Things like that. And hasn't come to fruition. And obviously, Remix is very married to the React story. So excellent point around like. Astro really could make a play in this space and do some things.

**Jason Lengstorf:** [24:06] And I think there's something interesting to be said about you build a tool for the needs of the time. And React was built in the mid-2010s for a very different set of needs. Like, the platform was in a different place, the browser was not what it is today. You were just missing a bunch of APIs that are way more commonplace today. And I think the other thing was we hadn't built so much of the infrastructure that makes things like Astro possible. So part of the major challenge is that a framework like Next is built entirely on the back of React, and to move to a multi-frame work thing, you're effectively rebuilding it from scratch. I'm probably glossing over some major technical details and caveats here, so take all this with a grain of salt. But Next is a React framework. They've never not said that. So for them to become multi-framework is effectively reinventing the whole thing. It's going to be the framework of Theseus by the time it's done because they'll have to replace every piece to get to a point where it can do something else. Remix, I think, a little less so. Remix is built largely on the web standards. They're using React as a view layer, but I already know they've got a path toward like Preact support now that they're over at Shopify with Jason Miller, who's the Preact maintainer. They're sitting pretty close together. It wouldn't surprise me at all if we see Remix on Preact soon. And if that happens, it's a pretty short leap to seeing React on Solid or Solid Remix on Svelte. So who knows? We'll see. I am very cautiously optimistic to see a sort of renaissance of like. Maybe we don't need JavaScript frameworks so much as we need web-building frameworks. And I think that's why we've seen more of a. Even the React team is like. We shouldn't use React. You should use a framework for React, right? Andrew Clark is out on Twitter saying, use Next, don't use React. Which is interesting to me because, to me, that sort of signals we've lost the need for React. React is now an enablement layer. It's a component layer that lets you use something like Next. And instead, we need web builder frameworks. And so the interesting thing about something like Astro, something like Solid, something like Qwik, they're built on today's requirements because they were built today. They were built. In the last couple of years. They're not dealing with the backward compatibility challenges that you get when you have a project like React that has been around for ten years and needs to be. You can't go break tens or hundreds of thousands of backward-compatible sites by saying, oh yeah, we've decided that we're not going to do all these polyfill things. I know that your internal intranet still uses Internet Explorer 6, but we don't care. Whereas Astro can say, hey, you wouldn't build with Astro if you're going to be using Internet Explorer 6 on your Internet because that's not what it's for.

**Chuck Carpenter:** [26:50] Yeah.

**Jason Lengstorf:** [26:51] Right, so they sort of get a start with this clean slate and say, we're making decisions for today. We don't have to worry about ten years ago, and you can give it another ten years, and Astro will be in the same place React is where a bunch of people have built on it, and now it's got backward compatibility challenges, and somebody will invent the next, next thing.

**Chuck Carpenter:** [27:08] Right.

**Jason Lengstorf:** [27:09] And that'll be great. I think that's the wheel of innovation, and I hope that we embrace that and don't dig our heels in and say like, oh no, we got to find a way to make the thing that I like work because it's always worked.

**Chuck Carpenter:** [27:22] Right, exactly. That sounds like a real boomer statement or something, except for no boomers are building in React at this point, but maybe they will eventually. It's funny because I'm thinking about positioning between all of these different libraries and frameworks that we're talking about. Right. So I mean React is developed for Facebook's purposes and has evolved through and has to constantly still meet Facebook's purposes. Like, they contribute to open source, but they're not incentivized by that necessarily. Right. Next.js has a company where great. I loved Next.js. I think it was a really great tool for a lot of things. It put guardrails around like crazy React application stacks because React's not an application framework. You have to fill in all the rest so you can choose your own adventure. And that was nuts for a while. I mean, sagas, I don't know, but Next, put some great guardrails around that let you build apps fast. You have some rules. Great. And this just works. But it's also designed for its best experience to be deployed in Vercel, and some of its underpinnings get utilized through that process of their deployment. And they're incentivized by that. They're monetarily incentivized by that at this point. So you make a great point around like if they have to completely rewrite parts to allow folks to bring their own view layer, why, though? Right? And then what's that cost for their hosting platform?

**Jason Lengstorf:** [28:48] Right.

**Chuck Carpenter:** [28:49] And then conversely, Astro, they aren't incentivized by that at this point. They have the corporate entity, but they're still focused on the tool, the best tool for the best purpose. Along that, I would argue that even though remix is in the Shopify house. They're still in a very advantageous early days position where now they've just been supercharged with money to do a great thing for a little while that will just make Shopify better. But Shopify isn't pushing it at this point.

**Jason Lengstorf:** [29:16] Yeah, I think the thing that's really interesting to me is the idea of open source being a direct funnel contributor. I think there's when you look at, for example, like, Netlify employs Zach Leatherman from Eleventy and Ryan Carniato from SolidJS, and now with the acquisition, they employ Kyle Matthews from Gatsby. And a lot of open source creators are employed at Netlify. And Netlify they don't monetize based on frameworks. They monetize based on hosting. They want you to host websites on Netlify. They don't need you to use specific features of specific frameworks to get that value. Astro, I don't know, I saw Fred talking about publishing his vision for how they're going to monetize, but they've stated pretty publicly multiple times they're not building a platform because I think the incentives are bad. We saw what it did to Gatsby, where Gatsby went really adversarial against anybody who wasn't hosting on Gatsby. We're seeing the right from the get-go. As soon as Vercel branded as Vercel, the Next.js docs became a walking billboard for Vercel. And if another company does try to make Next better for their platform, Vercel has every incentive to discourage making that visible. And they're not super incentivized to accept pull requests that would make Next more compatible with other platforms. And they do things like they always do a little bit to help. They launch docker containers so that you can self-host Next.js wherever you want with all the features of Vercel, fine. But if they open an adapter API, then Cloudflare and Netlify and Render and Fly, and all these other hosting platforms could build optimized adapters for their platforms. And as a result, Vercel is pretty incentivized to drop the docker containers and not the adapter API because they want their not-on-Vercel experience to suck a little bit. That's where their money comes from, right? And so I'm very curious to see with something like Remix, where the monetary incentive for Shopify is for people to get Shopify, you have a store, you're hosting products, you're selling things through Shopify. That's how they make their money. If you use Remix to publicly host your Shopify front end, that's good for them. That's why they were building Hydrogen, I think. And I suspect that hydrogen and Remix are going to sort of merge into one kind of super Shopify project that's good for them. But it doesn't matter if you don't because you can go build the next site that pulls Shopify data and host it on Vercel, and Shopify still makes money, right? So to me, that incentive is more clean, like they're trying to make it easier to build with Shopify, but it doesn't matter to their bottom line if you don't, as long as you're using Shopify in some way, shape, or form. So I wonder if when the VC money really dries up, or if Shopify has a downturn if they'll cut their open source. And we'll see if the same happens at Netlify if the same happens at Cloudflare at these companies. A lot of companies have an open-source division, and I don't know how well-funded any of them are. I know how well-funded Netlify is because I was there, but otherwise, it seems like everybody's got a lot of money going into open source right now. And I really, truly hope that that continues because I don't know that we function with like a sponsor-based OSS style anymore. And I don't think we function with OSS projects as businesses because we've seen that go pretty poorly.

**Chuck Carpenter:** [32:53] Yeah, it's a difficult model to challenge doing. It because you're interested, you want to learn things, and you're just a techie person. Now we're all getting older, and our wives like nice things, and it's just not tenable to do an extra 10 hours a week contributing back to open source projects. Not all companies give you time for that. And not all like. We have some small open-source projects that we contribute to. We've done a little bit with Astro 2 and all of that, but at the end of the day, that doesn't keep it functioning.

**Jason Lengstorf:** [33:30] Right.

**Chuck Carpenter:** [33:30] The main contributors, the main core teams around these projects can't function forever without some model that keeps it going. So it's a pretty tough challenge.

**Jason Lengstorf:** [33:41] And this really is the major challenge because I remember I was trying to sponsor projects when I was at Netlify because I had found a way to get some budget allocated. And so we were the first major sponsor of Astro, for example, and the first sponsor of Solid that was corporate. I think we were trying to get out there and trying to help people build the web. And I went to Svelte, and I went to Rich Harris, and I said, hey, can we be a sponsor? He told me, he's like, I'll be honest with you, money isn't actually the problem. It's finding people that can do work. So, like Svelte being a relatively visible project and Rich being pretty visible in the community, there's a lot of sponsorship for Svelte. It's not enough that they could sustain themselves full time on the project, which is why Rich ended up joining Vercel, to be able to focus full time. But there's enough money that they could hire or pay volunteers like they could pay people to be maintainers of the project. And the challenge is that there aren't enough people who have enough time to actually make significant contributions because the level of complexity to get onboarded into the core of a framework like Svelte or Next or Gatsby or whatever, it's big, and it's messy, and there are a million edge cases, and there's so much context that you just have to have. So you're looking at a really nontrivial onboarding phase. And if somebody doesn't stick around past their first pull request, like as a maintainer, why would you bother onboarding somebody for one PR?

**Chuck Carpenter:** [35:07] Yeah.

**Jason Lengstorf:** [35:08] It's so much of your time that ultimately results in very little. So how do we get the hands? How do we get people who have the time and the incentives to continue working on the thing? And I don't have an answer, but the solution that we went after at Netlify before I left was to just hire open-source maintainers and give them zero product deliverables. So, like, when we hired Zach Leatherman, well, at first, he was on the design marketing team, but we moved him to an OSS-only role where, like, his job is to work on Eleventy. It's like, do whatever you need to do for the open-source community. Like, that's why you're here. And he doesn't have product deliverables. He's not on the hook to market Netlify. There's no real strings attached. Just go make Eleventy great. Because that's what's important. And we did the same for Ryan. We did the same for, I think I assume that's what they're doing for Kyle with Gatsby, but it's like, try to give people an actual full-time job working on open source so that these tools continue to stay strong and well maintained without having to go out and build a damn platform.

**Chuck Carpenter:** [36:07] Right, but I mean, that's a unicorn position, too. So that solves the problem for people that broke through on big projects that they put a lot of time into before. And they got to cash a lottery ticket, basically, because that's not a position you apply for, you get asked to do.

**Jason Lengstorf:** [36:24] Right.

**Chuck Carpenter:** [36:25] And that's a real special position in these companies. And bear in mind that these are only happening in companies that are also providing developer-centric tools. Netlify isn't out asking Lululemon to participate. Maybe secondhand, they might become a customer, but they're not marketed as a direct customer there. And that kind of company e-commerce based retail things, they're never going to hire that kind of position. They don't care about the frameworks. They need the output. And then so, it's very specific. It's like nuanced.

**Jason Lengstorf:** [36:59] I think this is one of the hardest problems that we've got to figure out how to solve, and I feel like we've been trying to solve this forever. Open source is one of those things where at first, we couldn't get people to trust it, and now there's been a shift where people trust open source, and now we've got to overcome the problem where a lot of enterprises see open sources as quote unquote, free labor. They see that as externalized maintenance, as reduced headcount. Right. Instead of them having to build it in-house, they can use some open-source tool, and they don't factor in any budget whatsoever for keeping that open-source tool healthy. So the next major thing that we've got to figure out is short of making every open source project into a commercial tool, which of all of them, the only one that I think is actually profitable is Red Hat.

**Chuck Carpenter:** [37:42] Right. Yeah.

**Jason Lengstorf:** [37:43] Right?

**Chuck Carpenter:** [37:43] Yeah.

**Jason Lengstorf:** [37:44] And I'm racking my brain. I don't think any other open-source tool is profitable. The other open-source tools manage to build other businesses on top. Like Tailwind has Tailwind UI, but you're not paying for Tailwind. You're paying for prepackaged Tailwind layouts. Or they'll have pro serve, they'll have consulting, they'll have whatever it is, but it's usually not the open source itself. You're not paying for a commercial license of Svelte.

**Chuck Carpenter:** [38:12] Right.

**Jason Lengstorf:** [38:12] Yeah. So I don't know what that looks like. I don't know how we get there. But it does feel like this is something that we're going to have to, I mean, maybe we don't maybe we don't deal with it, and we just see open source sort of dwindles down to like there's a hobbyist market, and there's a couple of big ones that get funded by big players, and we'll wait for the next revolution.

**Chuck Carpenter:** [38:30] I think these things ebb and flow. So first of all, I would regress a little bit unto your comment around like, we're seeing a rise in enterprise organizations taking advantage of open source. And I would suggest that that's been happening for as long as possible. That has absolutely been happening for a pretty long time. And then you can cite someone like the Faker JS guy who just lost his shit when he couldn't afford his rent and screwed up that library that tons of packages were using. And there's even, like, more simplified nefarious ones that were, like, really root-level simple NPM packages that screwed up a bunch of things for these very reasons, realizing that they're getting like millions of downloads and some of those customers in that download, it's Microsoft, it's Google, it's whatever other corporate entity, it's Oracle, and they are not paying a dime back. They're not sponsoring like, oh yeah, they sponsor a conference, does shit for that person contributing for a decade plus.

**Jason Lengstorf:** [39:32] Right.

**Chuck Carpenter:** [39:32] So I would say that that kind of taking advantage of the open source community has existed for a pretty long time, and there's a lot of challenges in trying to say how do we support that? You could easily say, like, actually, where I'm going to go with that is, so we talked to Max, who created Brew, and he has this new thing now called Tea. I don't know if you've heard of it.

**Jason Lengstorf:** [39:54] I haven't, no.

**Chuck Carpenter:** [39:54] Tea.xyz or whatever. And it is about trying to basically using microfinancing to do some payment system around open source. The thing is, it's a blockchain thing, and obviously, right now, a lot of people are kind of poo poo on that ideology. But if you thought about every download had a microfinance payment back. And if you're getting a million downloads through Microsoft and maybe they're paying five grand a month or something or much less $50 a month, whatever it was, it's all like a big part of this. So it's an interesting way to sort of say we're trying to indirectly monetize that. And whether it's Tea or something else, who knows? But I do think, like, a micropayment strategy to get it, like if you were just like, oh, I throw $10 a month into the pool, and I get to use 100 tools, maybe that works. I don't know.

**Robbie Wagner:** [40:46] I think that's the right format. I think it's just like the problem with Tea is you need to use a different package manager. So, like, I'm going to Tea install all my stuff, right? So unless everyone jumps from NPM to Tea or whatever, that's not going to work. So you need a thing that just bolts on to where everyone is already installing stuff that you can say, like, okay, Microsoft, we realize you just made $50 million off of using this tool. You should probably give back like $200,000 or something like a reasonable kickback comparatively to the amount, but.

**Jason Lengstorf:** [41:22] What we're slowly walking toward, and I think this might be my nuclear take for the episode, but what we're walking toward is taxes. For real. It's the same idea as being in the public sector and being funded by grants. I think we're moving toward a little bit of, like, if you use open source, you need to pay X amount of your profits. And it can be a small amount, it can be 1%, 0.5%, whatever. And that goes into a pool that's used to write grants that allow people to work on open source full-time. And it lets us keep these things healthy in a way that's sustainable for people. And that's going to create a weird little cottage industry of grant writing for OSS folks and whatever format this takes. But I don't think there's any way outside of making it like a legal obligation to fund the things that you use. The same way that we're legally obligated to fund firefighters, and we're legally obligated to fund public libraries. Nobody would do that by choice. There's this tiny little group that would happily go and donate $25, $30 a month. And we do, like, you know, I have my list of charitable donations I make every month.

**Chuck Carpenter:** [42:33] Right.

**Jason Lengstorf:** [42:33] But I'm not doing enough to keep somebody employed full-time.

**Chuck Carpenter:** [42:35] No. Right.

**Jason Lengstorf:** [42:36] And so I think it needs to be like something that is legally required because otherwise, why would companies do it? They'll never opt into expenses. They have to be required to have expenses.

**Chuck Carpenter:** [42:47] Right. That's not capitalism. Right. They're not doing what's best for their community and humans as a whole. I mean, that's proven itself over and over.

**Robbie Wagner:** [42:55] Unless it's for a tax write-off.

**Chuck Carpenter:** [42:57] Right, exactly. Yeah. Do they get further tax reduction no?

**Robbie Wagner:** [43:01] But they could, like, if you made this, you have to pay for open source, and it's a tax write-off. That's somewhat of a benefit for them if it can be qualified as a charitable donation. Whereas, like now, if you contribute to open collective, 90% of that is not a charitable donation. Which is some bullshit, in my opinion.

**Jason Lengstorf:** [43:19] Right. Because each project has to register as a 501(c)(3), and most of them don't.

**Robbie Wagner:** [43:25] Right.

**Jason Lengstorf:** [43:25] It's a pain, like the paperwork involved in registering as a charity and making sure that you're above board with your finances and stuff. It's not an insignificant amount of work. I do think there are ways that you could do it, but I don't think anybody wants to do it because this is not going to be a huge profit center. This isn't the sort of thing that you get VC funded and get a ten x return on. This is going to be like opening up a Planned Parenthood. It's a slog that helps so many people and is very rewarding emotionally and not rewarding financially. And I just don't know how we get somebody to take up that mantle.

**Chuck Carpenter:** [44:00] I think the Planned Parenthood take could be your nuclear statement for this episode. And I'm liking it. I'm trying to think of how I can one-up it a little bit. There's so many nuggets of wisdom there. I'm going to take it back, actually, a little bit noodle on that one for a moment. And we were talking about various frameworks and incentives and all that kind of things, a bit like at least early on in our show, we talked to Tom Preston Warner, and I saw you had actually Robbie noticed it a RedwoodJS hat in your background that looked like it the acorn thing.

**Jason Lengstorf:** [44:30] Yeah, there's one back there.

**Chuck Carpenter:** [44:31] So in the scale of like a web-making framework and one that actually could also have an interchangeable view layer, like what? Thoughts, feelings, feedback, anything about RedwoodJS, because I mean, it's a full stack web framework.

**Jason Lengstorf:** [44:45] Yeah, Redwood feels the way that Rails feels in that it's giving you a very opinionated, very kind of done-for-you style of building where you say, I need a new page, and you just tell the CLI, give me a new page, and it kind of spits out everything that you need. And I think that is such a powerful way to approach building at scale. Because, again, earlier, we were talking about the challenge of adoption. When you've got a big team where you need people to do things a certain way, and it has to be done in a way that, like if I get transferred between teams, I don't have to do a month of onboarding to figure out how the other team writes code. It's I should be able to be productive on day one. And you do that through standardization. I think that's one of the things that makes Angular so popular is at the enterprise level is that Angular is Angular. You don't find like a bespoke Angular app. They all look the same, they all feel the same. They're all generated with the CLI. And that's very much by design, and that's a huge strength. And people will say that Angular is too heavy on Boilerplate. But I'll tell you what Angular Boilerplate is what makes it so portable in terms of skill sets. When you move between Angular projects, there's not a lot of variance in what you're seeing in there. Like, an Angular project is an Angular project. The same cannot be said for React. Like each React project I've been in is completely wild west. So when you get into Redwood, Redwood has that predictability of Rails and of Angular, where you know you're going to see the same code in every Redwood project. And I think that's great. It's also the reason why I don't use it, and that's because I'm not a big team. I'm an individual. So for me, I like to write code like it's fun. And most of the projects that I work on are my personal projects. So for a smaller thing, like a blog or a personal project, it feels like if I didn't want to deal with the code, Redwood would be great. But because I like dealing with the code, I don't really want Redwood to do most of my job for me. I want to fiddle with it and get it wrong and mess with the folder structures. I think it's one of those things that I'm curious to see how Redwood solves that gap of, like, how do you get developers to adopt it individually to sell it up the chain? Or is it just something that's not going to happen that way, where you instead need to go in at the middle and get engineering managers and tech leads to adopt it on behalf of their teams?

**Chuck Carpenter:** [47:11] I think they're attacking it from the standpoint of founders because they're saying we are the framework for startups. Because of this, you're going to ship fast. We've made all the beginning architectural decisions for you, so come choose this ship fast. And your MVP is way more full-featured because you didn't spend time over here.

**Jason Lengstorf:** [47:29] Yeah.

**Chuck Carpenter:** [47:30] And that's interesting. I think that's a compelling story, and really didn't get to spend much time with it in the way that I kind of it came into my purview around the same Remix Astro time. And then I felt a little like I'm overwhelmed. What do I want to do then? I would ask you then, do you use TypeScript in your personal projects?

**Jason Lengstorf:** [47:49] I do, but not for the reasons that I think a lot of people use TypeScript. I use TypeScript because I want autocomplete. And if using TypeScript gave me strict type safety and all of the benefits TypeScript and nothing autocompleted, I wouldn't use it.

**Chuck Carpenter:** [48:06] Right. Because it's a lot of overhead, right?

**Jason Lengstorf:** [48:08] It's one of those things to me that feels like a fun puzzle, right? Like writing TypeScript types, when you get beyond a certain level, is like doing sudoku. You're trying to untangle this logic, and you're trying to figure out a way to get your types to work and to cooperate and merge these two complicated arguments into one cohesive type that doesn't lie to you about if it's this one or this one, you're not getting crossed properties. That stuff is so fun. There's so much fun logical puzzle in there. And I don't care. Like, I don't care at all. When I am writing TypeScript, I'm doing it because I'm exporting a function. And when I import that function, I want to get into the parameters, hit command space, and see what I'm supposed to put in there, right? That's all I want. And so, I will do the bare minimum TypeScript required to get that outcome. So, like, internally, I don't type internal objects. If they're all in the same file, I'll get to it if I'm exporting something. That's about the time I start to care. But I do really like the power of TypeScript. I love that if you hover over something, it'll show you what's inside of it. I love that you can do the dot to autocomplete. And that stuff is really powerful. So I like it for personal projects. And I've started just defaulting the TypeScript because everybody pushes that way and because all of the frameworks now are doing a really good job of building that autocomplete into their APIs. So if you start a new project with Solid or Astro or Svelte or Next or View, or Nuxt, they all have autocomplete for all of their APIs. And especially with some of this really cool stuff coming out. Like, Tanner Linsley did a router recently as part of the TanStack, and that thing is type-safe in a way that I haven't seen just. It infers everything. It knows you feed it in a route, and it knows stuff about your route. So it's somehow managing to get your data to then infer in a way that you can use it with autocomplete elsewhere. And I'm like, oh, it's amazing, right? So that I'll use TypeScript for that. That stuff is incredible. If I had to build the TanStack router, that thing would be written in JavaScript. You would have no autocomplete. I am very sorry.

**Chuck Carpenter:** [50:15] Sorry only to yourself. It's totally fine, right?

**Robbie Wagner:** [50:18] Yeah. So we should probably move a little bit into some not-tech here with some really important hard-hitting questions like, what are your favorite pajama pants? Because I saw on your website that you love pajamas.

**Jason Lengstorf:** [50:31] I do love pajama pants. So somehow, not somehow, very much by design. I have maneuvered myself in every company that I've been a part of into being like the swag lord.

**Chuck Carpenter:** [50:45] On purpose.

**Jason Lengstorf:** [50:46] It is very much on purpose. I always want good swag. And I feel like a lot of companies, not through intention, but just because it's not something anybody's actively focused on, they end up with a T-shirt and maybe some socks and a mug. And that's what their swag is. And that's fine. But I want cool swag. I want custom pajama pants. So at Netlify, I actually worked with one of our designers, Rafa, and we came up with, like, we designed our own plaid pattern and made pajama pants that are like the all-over plaid print with the logos in them and all that. It's super fun. And it's like a cool thing that is not that hard to do. Right. If you can get a repeating pattern, you can call one of these companies, and they'll manufacture a custom pair of pajama pants for, like, you know, $14 a pair or something with a 30-pair minimum order. So, like, any company that has any level of income can probably manage to do a limited drop of custom pajama pants. But yeah, so the my favorite pajama pants are the ones that I have designed myself because it just makes me smile when I get to pull out a goofy piece of my art and wear it all day around the house.

**Chuck Carpenter:** [51:56] Yeah, that's pretty cool. The custom Netlify tartan, like, you're prepared to go to war with Vercel now wearing your own tartan. They got shit. The gauntlet has been dropped on Guillermo. Make your own pajama pants, bro. He doesn't listen to this.

**Robbie Wagner:** [52:11] No.

**Chuck Carpenter:** [52:11] So, another interest that you have, and this one speaks to me a little bit because I am obsessed with burgers. I watched The Burger Show on YouTube. It's probably, like, one of the few other shows on YouTube I watched aside from, like, Hot Ones. Hot Ones is like, but I love The Burger Show. I love smash burgers in particular. They're my go-to as well. And I know that you and Sarah had a little burger off, at least planned. I don't know if it ever came to fruition, but I saw both.

**Jason Lengstorf:** [52:37] Only planned. We haven't been able to make it happen.

**Chuck Carpenter:** [52:39] Yeah. And so I know you both had your versions. I'm still very skeptical of her sous vide version as well. It just seems bougie as shit.

**Robbie Wagner:** [52:48] Sous vide smash burgers?

**Chuck Carpenter:** [52:49] I want to try it.

**Jason Lengstorf:**: [52:51] So the funniest part about those burgers is that I was talking about how I was making my smash burgers, and she was talking about how she was making her sous vide burgers, and both of us were giving each other shit for being over complicated. Right? Like, you know that episode of Parks and Rec where Chris Traeger challenges Nick Offerman's character to, like, a burger off, and he's going to make this really very cool turkey burger with a special glaze and all these different things. And then Nick Offerman is like, this is a burger on a bun. You can add ketchup or not. I don't care. Right?

**Chuck Carpenter:** [53:25] Yeah.

**Jason Lengstorf:** [53:26] And so both of us were accusing the other of being Chris Traeger in this circumstance, which I understand, because my smash burgers have a lot of rules, if not a lot of ingredients, and the sous vide just feels like a lab kit, right? Like, you're going to kind of make your burgers in a lab. I have not had the sous vide burgers, but I have no doubt in my mind that it is delicious because sous vide is an incredible way to cook. And if you get the burger cooked perfectly and then get a sear on it, it's going to be an incredible like. It will 100% be an incredible burger. Now, I don't like really thick burgers, though. Like, I don't want a medium rare burger that's an inch thick. That's, like, basically raw hamburger meat in the middle. I like a medium rare steak. I don't like a medium rare burger.

**Chuck Carpenter:** [54:08] Yeah.

**Jason Lengstorf:** [54:09] So for me, at least, I like a smash burger because what I want in a burger is the crispy sear. I want the cheesiness, and I want the bun to soak up that grease. That's what I want in a burger. If you put an onion ring and guacamole and, I don't know, gold leaf on your burger, I'm just pissed off because, to me, you're masking up your subpar burger with a bunch of toppings. Also, if I have to smash your burger down to get it into my mouth, I'm like, Why? Why are we doing this?

**Chuck Carpenter:** [54:46] Yeah, you've lost the plot a little bit there. Yeah. Like, I'm intrigued in a way that I've made pub-style burgers like that before, and you can reduce some of the toppings, you get nicer grinds or whatever. Maybe I'm not finding the right mix in the grind, but it's kind of the same thing. I don't want that weird ground beef mushy texture in the middle of my burger in the way that I want, like, a melty, you know, medium rare steak.

**Jason Lengstorf:** [55:09] Right.

**Chuck Carpenter:** [55:10] So I'm a little like, I don't know, maybe I haven't hit the mix on that, but even if I'm doing, like, some of those toppings and stuff, I want still a little crust and a little grease and all of that. Like, smash burgers, to me, have been the way forward. I don't know if you've seen The Burger Show or like.

**Jason Lengstorf:** [55:26] I have.

**Chuck Carpenter:** [55:27] Seen any of this stuff with George.

**Jason Lengstorf:** [55:28] I did a whole pilgrimage to Amboy in La. Because I really wanted to. I was like. I got to try this. I went with Chan, Michael Chan, and Chance Strickland from the remix team. We went and did like I was in San Diego with my partner Marissa.

**Chuck Carpenter:** [55:42] Oh, do you know that means a whale's vagina? Right? Such a weird but obscure fact that most people don't know about San Diego. Sorry, I just wanted to slip that in.

**Jason Lengstorf:** [55:54] So we were down there, and we asked you where I was talking to Chan about all the places we wanted to eat, and he was like, okay, how absurd would it be to drive up to La for a meal? And I was like, how good is the meal?

**Chuck Carpenter:** [56:09] Yeah.

**Jason Lengstorf:** [56:10] So we rented a car, we drove up to La. And we did, like, a pilgrimage out to Amboy, which Amboy is a butcher shop and smash burger place, and it is set up in this strip mall in Chinatown in La. That you feel like you're very much in the wrong place. You're kind of turning down this alley, and it's, like, dark, and half the shops are closed, and you're like, where am I? Am I lost? And then you turn the corner, and you're at Amboy, and it's like just this cool little shop, and they'll make you one of the best smash burgers ever had.

**Chuck Carpenter:** [56:40] Yes.

**Jason Lengstorf:** [56:41] But yeah, I love that show.

**Chuck Carpenter:** [56:42] Yes.

**Jason Lengstorf:** [56:42] To answer your question.

**Chuck Carpenter:** [56:43] Do you have George Motz's book?

**Jason Lengstorf:** [56:45] I have read George Motz's book, but I don't have a copy of it.

**Chuck Carpenter:** [56:49] I've tried to make everything. I've made everything other than the steamed burger that he does that's out of. I don't remember where it was out of, but that one's a weird one. But, like, the deep-fried burger very interesting. You get similar crust. You got some greasiness, and some of, I forget, the one that's, like, stuffed with cheese, but you got to put holes in it, specifically the way that.

**Jason Lengstorf:** [57:08] The Juicy Lucy style.

**Chuck Carpenter:** [57:11] Yes, those yeah, it's kind of fun. So, anyway, I also geek out on burgers.

**Jason Lengstorf:** [57:16] Yeah. For me, cooking has always been something that it was not something that I loved when I was a kid. My family was not like a big cooking family. My mom doesn't like to cook. My dad is very much like, everything's fine if you make it a stew kind of thing. Like, we don't waste food. We just throw the iceberg lettuce into a pot and boil it. And I was like. I don't know if I like food.

**Chuck Carpenter:** [57:40] I'm just trying to stay alive here.

**Jason Lengstorf:** [57:43] My first job was at a restaurant, and I was in the dish pit, and it was a woodfired pizza place, and they also had a full kitchen in the back that was kind of Italian-style cooking. And I would, every shift meal, order a pepperoni pizza. And the chef one day was like, do you eat anything else? And I was like. I like pepperoni pizza. And he's like, yeah, but we got a lot of good food here. Have you tried any? I was like, I don't think I like any of this stuff. And he took it upon himself to fix me, which I very much appreciate in retrospect because he introduced me to well-cooked everything. Like, I used to think that vegetables only came out of a can, and I thought they were all disgusting. And I used to think that chicken was always, like, dry and sucked all the moisture out of your mouth because my mom was worried about making us sick, so she would err on the side of overcooking the chicken versus giving us something that might have salmonella. Right. So there was just stuff like that that wasn't really. I'd never had a juicy piece of chicken. I'd never had, like, a butter-sauteed piece of broccoli or something. Like, none of those things were even in my realm of existence. So when I discovered that food could be made, well, it became an interest. And then when I got older, and I actually had enough money that I could afford to invest in good cookware, and I could buy the nice ingredients and go to the farmer's market, and I could afford the luxury of that stuff, I got really into cooking, and it's just sort of become this it's the way that I spend time with people. I'm not good at. I don't drink a ton. I don't do well at just, like, sitting and talking to somebody. But I love feeding people. So my way of being social and having people around is to feed a big group of people. And my partner is the same way. So we're always, like, hosting dinner parties or something, and yeah.

**Chuck Carpenter:** [59:31] You're in Portland, right?

**Jason Lengstorf:** [59:32]I am.

**Chuck Carpenter:** [59:32] I'll see you in July.

**Jason Lengstorf:** [59:34] Great.

**Chuck Carpenter:** [59:34] I like to eat. You like to cook. These are great things.

**Robbie Wagner:** [59:38] We'll meet you at the whiskey library.

**Chuck Carpenter:** [59:40] Oh, yeah, that's true too.

**Jason Lengstorf:** [59:41] Perfect.

**Chuck Carpenter:** [59:43] Yeah, no, that's an awesome thing. And I can definitely sympathize with a lot of that whole getting into cooking and understanding. Although I did grow up with grandparents that could make great Southern cooking, but outside of that, yeah, Southern food. With my grandparents, everything is homemade and has a ton of lard, and it was amazing. And then you had, like, you know, I grew up on a lot of microwave meals and whatever else, especially a teenager with, like, a single mom. Where did you grow up, though? Was it Portland?

**Jason Lengstorf:** [01:00:08] I live. I grew up in Montana.

**Chuck Carpenter:** [01:00:10] Oh, wow. Nice. Love that. Yeah, my wife has family in Bozeman, and then now they live in Stafford or, I don't know, around the mountain from there.

**Jason Lengstorf:** [01:00:21] Got it. Yeah. I have grandparents in Bozeman. I grew up in Whitefish, which is up by Glacier National Park. And I spent a lot of time in Missoula, Montana, when I was still trying to be a rock star. That was kind of the staging ground for my band.

**Chuck Carpenter:** [01:00:34] Yeah, very cool. Do you fly fish?

**Jason Lengstorf:** [01:00:36] I have attempted to fly fish, actually. I'm not allowed to fish with my family anymore. I am not a superstition person, but I am absolutely cursed. I have been on a commercial fishing vessel with my dad and my uncle, and it's one of the ones that goes off the coast of Oregon. They use a fish finder. They get a big old group of fish, and they just give you a fishing pole where you push a button, and the hook drops down, and then you reel it up, and you catch a fish. Like, it's literally shooting fish in a barrel. Everybody on the boat caught their limit except for me and the person directly to my left and directly to my right, who got no nibbles whatsoever. Like, the captain of the boat came and, like, checked my bait, switched my pole, like, made sure I was doing it right. I got nothing. The fish could tell that it was me, and they were uninterested in my bullshit. So after that, we got off that boat, and we had to do the walk of shame, where everybody on the boat has their bucket of fish, and they're waiting to get it because those vessels will filet the fish and kind of freezer pack it for you so that you can get it home. And we had to walk up with our empty buckets, and everybody else on the boat is looking at it's like, what happened to you? So, my dad, we got to the top of that dock, and my dad is like, you're not coming with us again.

**Chuck Carpenter:** [01:01:52] It's a waste of money for you. Just don't bother. That's funny. Well, you know, yeah. Everybody has their niche, and sometimes it's not what would seem obvious. Right?

**Jason Lengstorf:** [01:02:06] I think what I've learned about myself as an adult is that if the electricity ever goes out, I will be food. That's about the only purpose that I'm going to serve.

**Chuck Carpenter:** [01:02:15] So when Chat GPT rises up and takes over the world and the machines all try and kill us.

**Jason Lengstorf:** [01:02:24] I'm toast. I'm done.

**Chuck Carpenter:** [01:02:25] All right. Get behind you. They'll shoot you. That's it. Good enough. You're the first one we eat. I got it.

**Jason Lengstorf:** [01:02:31] Exactly. Yeah.

**Robbie Wagner:** [01:02:33] All right, well, on that note, we are overtime here. Is there anything we miss talking about or stuff you want to plug before we end here?

**Jason Lengstorf:** [01:02:40] Maybe. I don't know. Come watch my show. It's fun. I'm on Twitch all the time. You can find links to me everywhere at jason.af/links is sort of a list of everywhere that I hang out online, so come hang out.

**Robbie Wagner:** [01:02:52] Cool. Thanks, everybody, for listening. If you liked it, please subscribe. Leave us some reviews and ratings. We appreciate it, and we will catch you next time.

**Chuck Carpenter:** [01:03:03] Thanks for listening to Whiskey Web and Whatnot. This podcast is brought to you by Ship Shape and produced by Podcast Royale. If you like this episode, consider sharing it with a friend or two and leave us a rating, maybe a review, as long as it's good.

**Robbie Wagner:** [01:03:18] You can subscribe to future episodes on Apple, Spotify, or wherever you get your podcasts. For more info about Ship Shape and this show, check out our website at shipshape.io.
