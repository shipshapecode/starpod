**Robbie Wagner:** [00:09] Hey, everybody, welcome to another Whiskey Web and Whatnot with myself, Robert William Wagner, and my cohost, Charles William Carpenter III, with our guests today, Dan Gebhardt from many many things, Ember core team emeritus, I believe, and JSON API and Orbit and lots of stuff.

**Chuck Carpenter:** [00:31] The most important bit here is so it's Gebhardt. It's not Gebert.

**Dan Gebhardt:** [00:34] Yeah, you got it.

**Chuck Carpenter:** [00:35] Oh.

**Dan Gebhardt:** [00:36] Very good.

**Robbie Wagner:** [00:36] So I said it right?

**Dan Gebhardt:** [00:38] Passed the first test. Yeah.

**Robbie Wagner:** [00:39] Okay, cool.

**Dan Gebhardt:** [00:40] Beautiful.

**Robbie Wagner:** [00:42] Nice. Yeah. Thanks for joining us. If you want to give a quick intro into who you are, what you do, and just a few sentences and let people know who you are.

**Dan Gebhardt:** [00:52] Sure, thanks. Yeah. I suppose most people listening to this will know me from some of my open-source work. I've been working on the web since the late nineties, so going way back. And I really got started in open source about, I would say ten or twelve years ago. So I've gotten to the point where I had almost too many things going. I was apart of the Ember core team working on JSON API and a pretty big project with Orbit.js, and I actually alumnized myself from the core team last year so I could give a little focus to some of the other projects. I also do consulting mostly on web projects, mostly using the tech that I helped work on in open source. So I have a small consultancy with my brother Larry, and he tends to work on the back end, I tend to work on the front end, although we both are sort of full-stack devs, so not unlike Ship Shape Code. But I also work a lot with Tilde, the company co-founded by Leah and Yehuda Katz, and others. And we often do our consulting through them, so some of our clients will only know us through them.

**Robbie Wagner:** [02:16] Cats out of the bag now with a 'K'.

**Dan Gebhardt:** [02:20] There you go.

**Chuck Carpenter:** [02:22] So in terms of back-end technologies that you work with, do you do Ruby or is Yehuda pulling you into Rust or something else?

**Dan Gebhardt:** [02:32] Yeah, we mostly use Ruby and primarily Rails. Larry is the lead maintainer of JSON API resources. Pretty popular gem. That makes it pretty straightforward to stand up JSON API server Rails. So that's been our main focus. So we sort of have that JSON API contract at the middle, and we tend to build on either side of it. Those are most of the projects we work on.

**Robbie Wagner:** [03:01] Got you. So before we get too deep into all this tech, though, let's open some whiskey.

**Dan Gebhardt:** [03:05] Nice.

**Chuck Carpenter:** [03:06] That's why everyone's here, really.

**Robbie Wagner:** [03:11] We heard you like scotch, so we got something that's hopefully kind of scotchy, but a little bit different. So this is the Nikka Single Malt Miyagikyo. I don't know how to pronounce that exactly.

**Chuck Carpenter:** [03:25] Sounds accurate to me. Yes.

**Dan Gebhardt:** [03:28] You get points for trying, though. That's as good as I could do. It's been ages. I've only had, I think, one Japanese Scotch before, so it should be a good adventure.

**Robbie Wagner:** [03:38] Nice.

**Chuck Carpenter:** [03:39] I think you're legally unable to call it that.

**Robbie Wagner:** [03:41] Yeah, it can't be called Scotch.

**Chuck Carpenter:** [03:43] There are no Japanese Scotches. There are Japanese whiskies.

**Robbie Wagner:** [03:47] It's like an American champagne.

**Chuck Carpenter:** [03:49] Exactly. You can't do that. Okay. Well, it's got a nice kind of peaty smell to it. Scotchy Scotch scotch.

**Robbie Wagner:** [03:57] Doesn't have a cork, though. There's no pop.

**Chuck Carpenter:** [03:59] No, no pop. Scotchy Scotch Scotch, that's a big pour. Alrighty. I have had other Nikkas.

**Robbie Wagner:** [04:12] Yeah, it's a pretty popular Japanese brand, I believe.

**Chuck Carpenter:** [04:16] Yeah. There's one that's like a blend called From The Barrel. It's a good one I've had a couple of times, and I've had their 12, and their 17 before. Oh, and the coffee grain one. That one's pretty good.

**Robbie Wagner:** [04:28] So this is 100% malted barley. It's 90 proof. And it says on the back that it uses less peaty malt and is distilled in a pot still, heated by indirect steam. For those that know what any of that means, that looks like a lot of whiskey.

**Chuck Carpenter:** [04:43] Yeah, it's probably too much. Also, it either looks like apple juice or pee.

**Robbie Wagner:** [04:47] Yeah.

**Chuck Carpenter:** [04:47] Don't let that influence your thoughts, though. With the smell. Was more peaty, but I actually get a little smoke on the finish.

**Robbie Wagner:** [05:00] I was getting a little bit of lemon on the smell. Like acidic.

**Chuck Carpenter:** [05:04] Yeah.

**Dan Gebhardt:** [05:04] Yea, it's very smooth. It's not aggressive in any way. I think it's very easy to drink.

**Robbie Wagner:** [05:13] Yeah.

**Dan Gebhardt:** [05:13] Not too peaty, not too smoky, but pretty balanced.

**Chuck Carpenter:** [05:17] Yeah, I would agree with that. It's got a little hug.

**Robbie Wagner:** [05:20] Yeah. I would say it's a good middle-of-the-road. A little bit of peat, a little bit of smoke, a little bit of sweetness. I think for someone who doesn't love a real peaty scotch, this is pretty good.

**Dan Gebhardt:** [05:31] Definitely. Yeah.

**Chuck Carpenter:** [05:33] All right, Dan, so you are familiar with our rating system. Cleverly. Following the octopus' eight tentacles. So one to eight, one being horrible, throw it out the window. Eight being I will never drink anything else every chance I get on this one or anything in between. How do you feel?

**Dan Gebhardt:** [05:55] I think it's at least six and a half.

**Robbie Wagner:** [05:57] Pretty good.

**Dan Gebhardt:** [05:58] Is it cruel to cut the tentacle? I don't know if we do half.

**Chuck Carpenter:** [06:02] Ouch. It's painful.

**Robbie Wagner:** [06:03] People have.

**Dan Gebhardt:** [06:04] It does sound painful.

**Chuck Carpenter:** [06:06] Yeah, people do. You know there's rules in so many areas in life, like, not having any rules around this feels good to me. I need a place to rebel. Robbie and I have been trying to categorize now instead of being, like, out of all whiskies, what would you think? So I would say between Japanese whiskies and Scotches that we've had thus far, or just in life, I guess I would put this at, like, a seven. I would definitely have this again if I was in the mood for something like that. Like you said, I think it's really well balanced, but has flavor. Seems to kind of evolve. Every time I take a little sip, I think Robbie got into my head. So I am getting a little lemony, kind of yeah, I don't know about getting a little lemon there.

**Robbie Wagner:** [06:52] It's very fresh.

**Chuck Carpenter:** [06:53] Yes.

**Robbie Wagner:** [06:54] Yeah. I think having had ten or less Scotches than Japanese or Scotch style, I guess, whiskies. In general, I would rate this in the top 15% of the ones I've had. So based on my tiny bit of experience into this type of whiskey, I'd give it, I think, a Seven. Sounds good.

**Dan Gebhardt:** [07:15] I would buy that. It's a great summer whiskey, I think doesn't overpower you.

**Chuck Carpenter:** [07:21] Yeah, I would go as far to say as like, I agree with that. And I would even have this over, like an ice ball or large cube or something. And Robbie knows I'm not one to really change my whiskey much, but yeah, given this, I could see with a little chill, at least with some whisky stones to give it a little coolness, I think would be great.

**Robbie Wagner:** [07:42] Yeah, definitely.

**Dan Gebhardt:** [07:43] Do you guys add any water to your whiskey or do you drink it straight?

**Chuck Carpenter:** [07:49] So it used to be a little more diverse than that? Not normally, but if there's some really high proof, barrel proof stuff, it's like 120 or something, I would do that a little bit first and kind of see like, oh, does that open it up for me? And take a little edge off before I would go down the cube. But it is interesting when I try new things. When I used to do that, I was like, okay, you got to pour the first bit, you try just as is, and then you add a little water, a few drops of water, and change it up.

**Dan Gebhardt:** [08:23] Yeah, I tend to add a few drops.

**Robbie Wagner:** [08:25] I used to do ice in mine all the time. I had a totally not legit glass and I would just do tons and tons of ice and Chuck would always get upset at me for not doing it the correct way. So we have these somewhat legit glasses now. The Glencairne, or whatever it is they are.

**Chuck Carpenter:** [08:44] Yeah, they're Norlan. They're basically like two-layer Glencairnes. So the Glencairn in the middle and then has the outside layer to stop your hand from warming whiskey, which is maybe excessive.

**Dan Gebhardt:** [08:56] Yeah, that's a good idea. Yeah, I have some coffee and tea mugs like that. Why not whisky mugs that are dual-layer like that? That makes a lot of sense. It's the same purpose as a stem on a glass, right?

**Chuck Carpenter:** [09:10] Yeah, absolutely. Well, the Glencairn shape is also supposed to change how you nose the whiskey or something, but I don't know. It's supposed to give you both things.

**Robbie Wagner:** [09:19] Yeah, I think it does work. When it's really high proof, you get that, like, not as much alcohol to the nose. Yeah.

**Chuck Carpenter:** [09:27] So Norlan, if you're listening, we love your glasses. We think they're perfect for everyone. I would gladly have two more we've been working on sponsorship for a while. But I don't think we're doing a very good job because this assumes that in our tight little world that someone with power at Norlan Glasses could actually do something and have heard us.

**Dan Gebhardt:** [09:51] Yeah, you might have to play up the whiskey and the whatnot and play down the web. Maybe you're spreading yourself a little thin for the general audience.

**Chuck Carpenter:** [10:01] Those three things. That's true.

**Dan Gebhardt:** [10:04] Although I love it. I love the format. It's a good mix.

**Robbie Wagner:** [10:07] Yeah. I think for the specific subset of people that listen to it, it's a great format. But yeah, there are some people I think that are only interested in one of the three and then they are kind of like, I wish I didn't have to listen to 15 minutes of talking about whiskey before we get to the rest or whatever, but it is what it is. We have fun with it.

**Chuck Carpenter:** [10:26] This is what we like.

**Dan Gebhardt:** [10:28] Yeah, you're the ones putting in the work week after week, so you might as well enjoy it.

**Robbie Wagner:** [10:34] True.

**Chuck Carpenter:** [10:34] The hardest part is because of I'm on West Coast time and Robbie's on East Coast time, and so we do this at like 2 o'clock in the afternoon and then I have some whiskey and then it's like, do you want to do any more work today? I don't want to. That's the hardest part.

**Dan Gebhardt:** [10:54] Right? This is just 2 o'clock for you, Chuck?

**Chuck Carpenter:** [10:58] Yeah. Oh, well, yeah, I'll power through it somehow.

**Robbie Wagner:** [11:04] So, yeah, I guess we touched a little bit on some tech earlier, but let's dive a little bit deeper into some of this here. So I guess the first thing that we should talk about is well, most of what we're going to talk about is Orbit, I guess. And so what led you to create Orbit?

**Dan Gebhardt:** [11:20] It was a good seven or eight years ago when I first started Orbit and I was basically mapping out the data needs for an application I was building and trying to make sense of all those requirements and trying to apply them to other packages like Ember Data. I was already in the Ember world and so I was trying to how I could say adapt Ember Data to my needs, and I really couldn't back then, and I don't think I could even now with the set of requirements I had, which was basically an offline-first app that had an optimistic UI that needed to store data locally in the browser, obviously, and sync it up with remote servers, work offline and online, but also not just do that, but only some of the data needed to be offline. Like there's some data that makes sense to be offline and other data that really only makes sense when you're hitting the server and you're getting it all the time straight from the source. So with all those requirements, I was trying to put together how I could rationalize these problems for this app I was building. And I started to deconstruct the whole data universe, essentially all the aspects of a data library. And I kind of looked at it from first principles. And then Orbit was the result of all that work. I started to have a pretty clear vision of how I could tackle this set of problems and meet these requirements without trying to bend another package way beyond what it could was designed to do in the first place. And what I came away with, with Orbit, I think is something that is sometimes building for the hard case first also helps clarify the simple case. And I think that Orbit really scales from the very simple to the very complex set of requirements because I had a really tricky application that I was trying to build back in 2014 that had all these needs while I was building something kind of from scratch, putting an Ember layer for reactivity over the top, which is what Ember Orbit is. Then I started to look at every piece of it and try to break it down into components. And it's a pretty composable data framework, I think, that lets you think about your sources of data independently of the way that data flows between them, but apply like the same template to all your sources, treat them all the same, query from them the same, update them the same with the same language. You track all the data in a uniform format but allow for all these edges where data might be sent in JSON API format to the server, or it could support GraphQL. Could be a simple REST work with simple REST servers that could work with Sockets, but you know, it also could work with IndexedDB. And so the only way I could make sense of all this was to normalize how to interact with every source of data. And then the other piece is all the glue code. How do you get these sources to interact with each other? And that also made sense to like if they're talking in the same language, they can all listen to. You can set up listeners when they change and then you can also when a change happens, you can update them. So that's kind of got focused on the sources normalized format and the querying and updates, but also this glue code that allows you to put them all together in a single app.

**Chuck Carpenter:** [15:44] So that's the composability layer that you kind of were touching on. So yeah, it's interesting because you talk about a lot of solving different parts of those puzzle, that puzzle separately, drawing them together in a composable way, depending on your architecture and needs. You mentioned interacting with IndexedDB, for example. Could you utilize it as like an ORM for IndexedDB?

**Dan Gebhardt:** [16:09] Yeah, absolutely.

**Chuck Carpenter:** [16:10] Like one small part of that you.

**Dan Gebhardt:** [16:12] Could use Orbit to just query indexedDB like Dexie.js or something, right? Like some wrapper for IndexedDB, you could just use the Orbit source to query it and you could query all records of a type from IndexedDB and leave it to that Orbit source to find those records and then also update those records when you want them to. And so you could also use it just as a simple ORM for your REST server. Or at the very simplest case, you could use it to manage data and memory, just a memory source, which is what a lot of single-page apps are built with a cache. So that cache needs to be managed somehow and needs to be queried and updated. So you could just use that piece of the puzzle.

**Chuck Carpenter:** [17:05] Yeah, that's interesting because if you're not concerned with database persistency outside of the user's browser and if you wanted to use it initially for POC project or something. So instead of mocking things, I can have real interactions that are stored and then look at oh, when my data source is available later on. Now I'm going to introduce a syncing strategy. You know, things like that. It's interesting. So having a plan and that you can composably step through adding or using Orbit as your data manager and then that seems pretty interesting actually. I didn't realize that facet of it.

**Dan Gebhardt:** [17:47] Yeah, that's one of my favorite aspects of working with Orbit is using it as simply as possible to just prototype an app really quickly. And I fear that because Orbit has all these potential sources you can work with and use cases that it can solve. People overlook the very simplest case which becomes incredibly simple when you're just dealing with memory or cache in memory. And it makes it very easy to build to prototype POC and just provide a simple data layer in an app, even though it can do the more complicated things it doesn't have to.

**Robbie Wagner:** [18:28] Well, we started using Ember Data with Swatch, and then we had a problem where we needed to undo and redo things. Well, I'm kind of getting down the wrong path here, but it was really good to be able to release a thing that was just kind of IndexedDB based because we just wanted data locally, to begin with and we wanted to get that really good. And then one of the best things about Orbit, I think, is that I'm going to get the terminology wrong here so you can correct me, but the thought that each update or transaction or whatever is like you can replay them, they're always the same back and forth, they're guaranteed to...

**Chuck Carpenter:** [19:03] Oh yeah, they're immutable in history like that. Yeah, that's what worked for us.

**Dan Gebhardt:** [19:08] Yeah, you could think of it like Git where you have commits that you can play and replay. And in fact, a lot of the terminology for the memory sources which have an immutable cache at the root is based on Git. So you can do like a rebate, a fork, a merge, and so you can track changes, deterministically and create things like an undo-redo stack. You can also allow for complex editing contexts where you fork this immutable data structure which is really cheap, it doesn't involve any actual mutations to fork it. And then you're working in a branch-like you would be in Git and then you can either just throw that away or like say you do a bunch of complex edits, they're never going to touch the main branch anymore until you decide to merge them back in. And see, it gives you a lot of control over changes and your data that's in memory because it's built on the same sort of simple building blocks like Git commits essentially.

**Robbie Wagner:** [20:14] So would forking and merging be kind of a replacement for something like Ember change sets or something like that, where you could fork, make all the changes you want, and then if you decided you wanted to roll it back, you could just not merge it or something like that?

**Dan Gebhardt:** [20:30] Yeah, right. You wouldn't have made any changes to the main branch. It's like being able to check out a new branch in Git and try and experiment and then just throw that away if it doesn't work out. Meanwhile, the main branch might accept updates from the server, might get updates from Sockets and such and be updated, and then you want to merge those changes back in. And sometimes there could be, in theory, conflicts to which you'd have to deal with, so there's all those complexities if you decide to work with it that way. Overall, I think just like working with Git, it provides a pretty clear mental model at least and doesn't try to oversimplify things that are inherently complex, like data merge conflicts and such. Someone has to figure that out. And it can't always be the library.

**Robbie Wagner:** [21:30] Yeah, for sure. There's a lot of weird stuff that could happen if you went offline or someone else edited the same things you edited or something like that before you tried to save it. In that case, what happens in Orbit, like how does it flag that there.

**Dan Gebhardt:** [21:45] Is a conflict when you issue a merge? Number one, you could check first to see if essentially the main branch or the main cache here has progressed, has had any commits to it. I'll just speak in Git terminology to simplify things for the listeners who aren't using Orbit perhaps. So you can check the latest commit on main and see if it's changed since you forked and if it hasn't, then you're in the clear. Now if it has changed, then you can still merge and it's going to try to apply that merge. But of course, if you're say you're just creating a conflict, that merge could potentially fail, in which case you would have to decide what to do and you get a message about what the conflict was and so you could reasonably handle that conflict, hopefully, got you yeah, we can get you so far, but just like with Git merges we can't make all the decisions at the library.

**Chuck Carpenter:** [22:55] Yeah, you can't make some assumptions there and like trying to over enforce one direction or the other. Obviously, there'll be someone who's like but I wanted to be, I wanted to be you made me a this is a bug.

**Dan Gebhardt:** [23:07] Yes. I think that the important thing is to give you the tools to reason about these hard problems. And if you don't really care and you just want to do last trait wins, you can still just merge and overwrite whatever has come in from the server and it's probably going to be, probably going to be as good as any data solution out there. But if you really want to get analytical, you can handle that conflict a little more sensitively.

**Robbie Wagner:** [23:34] Yeah. I wonder what if there's any other libraries that try to handle that or I feel like some of this is pretty unique to Orbit because like you said, other libraries probably like, yeah, last one, just merge it, it's cool. We'll just do the last change. Do either of you know anything about some of the other options and how they handle things like this? Like how Orbit compares to them?

**Dan Gebhardt:** [23:53] I don't know. As to the basis of speaking publicly about it to say like I've done like an extensive compare and contrast, so I would be uncomfortable speaking about that. Like there certainly are some more some server libraries that are very much that are JS-based, that purport to be a good database, essentially. And I haven't really put them through their paces so much so I can't speak to them.

**Robbie Wagner:** [24:23] Got you.

**Chuck Carpenter:** [24:24] Yeah and are you incentivized to necessarily right like this is an open-source project, it solves your issues. You are an expert on that and it's not falling short for your needs. So you sort of like when do you go out there? Unless you're trying to market it and you want to see like, oh, this is still your alternative, this is why Orbit is better. But you're not really incentivized in that sense. It is interesting though, because I had perceived it some in different ways and I've only worked with Orbit a little bit for our very specific use case, but I kind of saw it in a way to like, okay, we're in an Ember app and we're trying to be offline first to a degree. We're also trying to convert an application that was only local to utilize an exterior. So it was checking boxes for our specific use case too. But the composability aspect of it and being able to step into it slowly is an interesting thing that I didn't realize as well. And I also understand it to be like it plays the friendliest with JSON API. So that was fine for us because we were in the Ember space. We're already conforming to that. But in terms of usage outside of JSON API. You said you could, have you used it with other specs or no spec whatsoever or GraphQL.

**Dan Gebhardt:** [25:42] Well, first of all, I would say I appreciate your perspective on that. I'm glad that you are able to see it just at that client layer that you don't need to know about all the inner workings under the hood. So that's a good sign about getting some abstractions right, because you weren't even concerned about that, like wiring things together. So that's great. There's composability within Orbit itself. It's made up of about 15 packages or so, and there are a number of them that are very low level that obviously they build up in complexity and work together. And there is just that sort of the top layer of the general Orbit libraries. It's like Orbit Data, which provides a really general abstraction for working with data that is not JSON API specific at all. But to make Orbit truly useful to me, I had to build Orbit Records on top of that, which is then used for all the standard sources. And so Orbit Records has that notion of relationships and attributes that is kind of unique to JSON API. I built some very simple things based on Orbit Data. It is possible to build a GraphQL abstraction that would work on top of Orbit data, but I have not built that. But it's very appealing to me to see that built because the typings are all there. It could be possible to query that data layer with a GraphQL query and it could serve the purpose of, say, Apollo or something like that, too. So it does have all those primitives in place. But I have focused on the JSON API happy path for now, and other people use it with different libraries. But I think that's the bulk of the usage right now, and it's definitely been scratching my own itch. But obviously, it's helped others like you all, and that's been my focus. But of course, given unlimited time and resources, I'd love to see through that, some of those other alternative realities.

**Robbie Wagner:** [28:06] Yeah, I'd be interested to see. I don't really remember a time, I don't know if you do Chuck, but what runspired had talked a little bit about that was like they had a JSON API flavored GraphQL or something like that at LinkedIn, where it was like sprinkle in IDs and attributes and things in the right spot and all of a sudden your GraphQL will just work in JSON API based thing. So there's probably like a nice middle ground there where you could do some of that. Maybe he would have thoughts on how we could help get some more people in to implement at least the middle ground to where we can kind of use GraphQL or something like that.

**Dan Gebhardt:** [28:48] Yeah, I really like working with Chris. He always has some good perspectives. The library you're talking about, I believe, is Ember M3 which is used by LinkedIn and was developed primarily by David Hamilton there. It works on top of Ember Data and it definitely could be compatible with Orbit at the right layer. It allows for a discoverable schema, which is the cool thing about it, I think, is that it doesn't attempt to pre-front load any schema concerns. It goes out and discovers that schema and deals with the data as it discovers the schema. So that sort of dynamic schema is certainly compatible with Orbit at the right layer.

**Chuck Carpenter:** [29:35] That's interesting. That kind of reminds me of JSON API Schema, which was kind of a discoverable schema where you would like, request that and then get what you could shape your response as kind of thing.

**Dan Gebhardt:** [29:49] Yeah, some people will associate like a description, like an open API or JSON Schema with their payload so that the whole schema is laid out in the possible values and so they can validate their data at a particular end point. So that's certainly something that's been that's compatible with JSON API that works well with it, and there's no reason that client library couldn't use that to discover the schema fully. And so it's all possible. All the hooks are there and such. There are some pragmatic realities about just how much dynamic stuff do you want in a client, especially if you're in a browser. Just how much do you want to load in terms of the schema and the discoverability into your main thread and basically discover your data dynamically as you pull it down? It doesn't often provide like an optimized experience for a web app which has to pull down all of its libraries and it could get very heavy weight.

**Chuck Carpenter:** [31:03] Yeah, it's nuanced and say you're editing an entity or creating a new entity and you don't know what all the options are for that entity. The schema is useful then, right? You want to present and you could dynamically generate forms based on the schema available and what are public fields and then pop that out. So, yeah, I would agree. There's like specific use cases around that. I will say be careful saying the word hooks. It's a trigger word for Robbie.

**Dan Gebhardt:** [31:31] Yeah, someone's been working in React.

**Chuck Carpenter:** [31:35] I don't think he really has. He just hates the concept of it.

**Robbie Wagner:** [31:38] Yeah, I like to see the things that React releases and says are cool and be like, why is this cool? Why don't we use classes instead of hooks? Everything was nice. You could just set state easily. Like state equals this and now it's like, no, I want to say, like, I got to use this and effect this and do whatever. It's too complicated.

**Chuck Carpenter:** [31:57] I'm going to try to get Eric Elliott on so you guys can argue about it because I think that will be great. He's been for years. Everything is functional. React is doing it right. Reactive programming functions, functions, functions. Classes are really bad is what he says.

**Robbie Wagner:** [32:12] Since React is like really popular and probably 75% of web developers use it, I can say for certain. I'm in the minority of saying all these things are not good, but I'm happy to debate it with anyone that wants to.

**Dan Gebhardt:** [32:28] Yeah, it's pretty much the 800-pound gorilla in the web development world and everything gets compared to it for right or wrong. So it does make new concepts of reactivity rather difficult. I really do think that Glimmer tracking and auto-tracking is a very simple paradigm for reactivity and quite nice to work with.

**Robbie Wagner:** [32:56] Or StarBeam now.

**Dan Gebhardt:** [32:57] And StarBeam is pretty exciting too. And that really cool thing about that is that it brings that concept of reactivity of auto-tracked reactivity into every framework that wants to support it. So it does allow for that level of build for this type of reactivity once and then access it everywhere, whether it's Svelte or Ember or React. It's a great experiment. I hope it succeeds, I hope it gets some traction. So it's pretty cool. I think it's the frameworks have too long been siloed and that we are now seeing some really interesting cross framework solutions out there, whether you're talking about StarBeam or even something like Remix or Astro, which are not actually maybe they're primarily focused on React because they are of course that's the most popular, but they are explicitly pluggable with that Reactivity layer and I think that's really cool. And I always tried to build Orbit from the start as a framework Agnostic layer and Ember sits as that reactivity layer. Ember Orbit sits as that reactivity layer that just sits on top. And it also works with React and Vue and other libraries too. So because that decision to be framework agnostic first was made, now it's got that compatibility everywhere. So I'm happy about that.

**Chuck Carpenter:** [34:32] Yeah, some future-proofing and I think it's good to BYOV on some things when many other libraries haven't really completely figured it out and that we should make the distinction there in the Vue library versus the framework thing where Remix, you write a whole app in Redwood, you write a whole app in Ember, you can write your whole app in. React you bring your friends. Which friends? Who knows? What I like about Next is that it's giving you some guardrails there of like we don't need all your friends. You can bring a couple of friends.

**Robbie Wagner:** [35:07] But there's a guest list.

**Chuck Carpenter:** [35:08] Yeah, there's a guest list. We've got a good group here, right? So I was just going to say like Robbie and I were talking a little bit. Ember and Orbit is how we know you what we talk about. Do you do anything else?

**Dan Gebhardt:** [35:25] I do a lot. I've got it aligned so that I'm using them in all those open source projects in my day job, so to speak, my day contract. And there's a nice synchronicity between my work life and my open source project so that's good. But I do love to get away from the computer, so I do hike a lot. I have an old colonial house that I've been working on for ages and continue to improve. I live in New England, here in southern New Hampshire, so I'm putting a slate roof over part of it. So that's been a fun little project. So restoring a roof that used to be slate that was taken off and now I'm putting it back on.

**Robbie Wagner:** [36:14] Why not?

**Chuck Carpenter:** [36:15] Yeah.

**Robbie Wagner:** [36:15] Slate is hard, very easy to break.

**Dan Gebhardt:** [36:18] Literally. Yeah. It's both hard and brittle.

**Robbie Wagner:** [36:22] Yeah.

**Dan Gebhardt:** [36:23] But once you get it up there right, and it can last for 100 years or more. Yeah. So I enjoy woodworking and doing projects and also I have a couple of boys in college now, which is kind of wild for me. So we just got an empty nest. My wife and I just have an empty nest this year for the first time. And it's been nice having them home for the summer, though, so that's nice. And I have a great dog who just turned I think he's just turned ten years old. And I've been working with a fun client for a while now that does dog DNA or pet DNA analysis.

**Chuck Carpenter:** [37:10] Oh nice.

**Dan Gebhardt:** [37:11] That's been really fun. Another, like, little synergy across my pets and my home life and my work life there.

**Chuck Carpenter:** [37:20] So you got to test your dog out.

**Dan Gebhardt:** [37:22] Absolutely, yeah. But I knew what he was in advance, so it was more a confirmation of the test than of him.

**Chuck Carpenter:** [37:30] Nice.

**Dan Gebhardt:** [37:31] But he is a mix and he's an interesting mix, so it was good.

**Chuck Carpenter:** [37:35] So if they told you poodle and he's a golden retriever, you've been like, I know better, I see no Fluffy.

**Dan Gebhardt:** [37:42] That's right. All my confidence that have been shaken in the scientists behind this.

**Chuck Carpenter:** [37:47] You have to fix the machine learning there or something.

**Robbie Wagner:** [37:50] I wonder how that works, because who decides what 100% poodle is or whatever, right. Like, there's slight variations.

**Dan Gebhardt:** [37:58] Oh for sure.

**Robbie Wagner:** [37:58] In that DNA, I would think. So that's a hard problem.

**Dan Gebhardt:** [38:02] Yeah.

**Chuck Carpenter:** [38:03] You're going to find out, Robbie, that your dogs are only 70% French bulldog. That's it only 70.

**Robbie Wagner:** [38:08] Well, one of them is way too tall. There's no way he's 100% French bulldog. He's got really long legs and they don't have that, so I think he's mixed with something.

**Chuck Carpenter:** [38:17] Refund.

**Dan Gebhardt:** [38:20] One of the interesting aspects of breeding is that even when you go to get a purebred dog, you're not there to keep the gene pool healthy and such. They need to always intermix other breeds and such that maybe were originally used to form that breed, and so you need to keep that gene pool fresh and so you might get a little bit you're not getting 100% French bulldog, whatever that means. You're always getting a mix. And so there is a little bit of a fudge factor and certainly, there's a huge sample set of data there that goes into determining how each breed is classified.

**Robbie Wagner:** [39:02] Yeah, definitely. So what kind of dog do you have? You said it's a mix, but what's it a mix of?

**Dan Gebhardt:** [39:07] He's a shepherd mix. He's a Belgian Tervuren and an Australian shepherd.

**Robbie Wagner:** [39:13] Nice.

**Dan Gebhardt:** [39:14] He's a big, fluffy guy who keeps guard over all of us. Nice dog.

**Chuck Carpenter:** [39:19] I like human-sized dogs.

**Dan Gebhardt:** [39:23] Yeah, he's not a lap dog.

**Robbie Wagner:** [39:27] Yeah. Human-sized dogs, though, make me a little bit worried sometimes. Like, one of our dogs is really aggressive, and if I had a human-size, really aggressive dog, it would be all over. Like you can't control.

**Chuck Carpenter:** [39:40] Yeah. But ironically, I find it to be the case. Like, the larger the dog, the lazier and more passive they are. Like, they're like, I could eat you.

**Robbie Wagner:** [39:50] Depends.

**Chuck Carpenter:** [39:51] In my experience.

**Chuck Carpenter:** [39:52] Yeah.

**Chuck Carpenter:** [39:53] And the frequency of small dog to aggressive is it just seems like more often. Wiener dogs, they're all mean. Chihuahuas, all jerks. So get smaller. Worst dog. I don't know.

**Robbie Wagner:** [40:08] True.

**Chuck Carpenter:** [40:10] Yeah, that's my opinion.

**Dan Gebhardt:** [40:12] Yeah. There's a reason there's a term ankle biter. Right. I mean, it's a good thing they don't get over the ankle. We definitely have some of those in the neighborhood that will go after our dog, and he just wants to play, but yeah, they have other ideas.

**Chuck Carpenter:** [40:30] Right. All right, Dan, you met many projects. Favorite power tool.

**Dan Gebhardt:** [40:37] Favorite power tool. Crosscut Miter saw.

**Chuck Carpenter:** [40:41] Boom. Wow. Yes. There you go. That's nice stuff. I don't have one of those. I'm a carpenter. I don't even have one.

**Robbie Wagner:** [40:48] Not by trade. Just by name?

**Chuck Carpenter:** [40:49] Yes, mostly by name. I do have a workbench with pegboards up, and then I take a lot of satisfaction in seeing how tools are organized on the pegboard. But, like, using them...

**Robbie Wagner:** [41:02] And they sit there.

**Chuck Carpenter:** [41:03] I got to fix little stuff here and there. But big projects. I'm replacing, like, kids playhouse, porch. I haven't had to do a lot lately. I'm good with that.

**Dan Gebhardt:** [41:12] Yeah. It's also nice to not just do work and not do work in your free time. Right. So to actually relax a little bit.

**Chuck Carpenter:** [41:21] Oh, yeah. My kids are young.

**Dan Gebhardt:** [41:23] Oh, yeah. How old are your kids?

**Chuck Carpenter:** [41:26] Three and five. So almost six. So relax in my free time, it's like daddy needs a project to relax. Yeah.

**Robbie Wagner:** [41:34] Something that needs concentration so you can't bother me.

**Dan Gebhardt:** [41:39] And Robbie. You're new to being a father yourself, right?

**Robbie Wagner:** [41:43] Yes. We have a three-month-old, so he was sleeping through the night for, like, two weeks and is now not again. So that's fun.

**Dan Gebhardt:** [41:55] They always keep you on your toes.

**Chuck Carpenter:** [41:58] Yes.

**Dan Gebhardt:** [41:59] Luckily, they're not instantly mobile, and you sort of all sort of get used to each other together and take things in stages and such. Even if I know it, some of those are a little painful.

**Robbie Wagner:** [42:12] Yeah. I always think about how crazy it is that humans are so helpless when they're babies, but that is a good point. If they were really mobile and could run around but had the same mental capacity that they have, that would be bad news.

**Dan Gebhardt:** [42:30] Yeah. Watch out for your power tools.

**Robbie Wagner:** [42:33] Yeah. So, yeah, you said you're in New Jersey, right?

**Chuck Carpenter:** [42:38] New Hampshire.

**Robbie Wagner:** [42:39] New Hampshire.

**Dan Gebhardt:** [42:40] Yeah.

**Chuck Carpenter:** [42:40] One of the news you've been nowhere new.

**Robbie Wagner:** [42:42] Yeah, I don't really know a lot about New Jersey or New Hampshire. So tell us about New Hampshire. What's the area you're in?

**Chuck Carpenter:** [42:51] Either. Just pick one.

**Dan Gebhardt:** [42:53] I used to visit my grandparents on Long Beach Island in New Jersey every summer for like a month, and I had just a great time there on the Jersey Shore, so it was not at all the Jersey Shore of popular.

**Robbie Wagner:** [43:09] TV show. Yeah.

**Dan Gebhardt:** [43:12] Chuck's pumping his fist.

**Chuck Carpenter:** [43:14] That's right. T-shirt time. T-shirt time. I lost a bet once and had to watch the first season. There you go.

**Dan Gebhardt:** [43:22] So I have some New Jersey roots and some fond memories, but yeah, New Hampshire is a little bit chiller and definitely there's a little more space. I think New Jersey might be like the most densely populated state, and New Hampshire is definitely not. There's a little elbow room. There are a lot of parks, a lot of state parks, and such. I work at home, so almost all my clients are remote, so I actually don't need to travel too much. But I'm only like an hour and 15 north of Boston, so I could get down to the big city or an airport very easily. So it's a nice balance. I really enjoy it here, and it's great to just be able to get out in nature every day, like walk my dog off lead and stuff without really worrying about the crowding or issues like that. But I guess it is a bit of a privilege to be working at home. I guess a lot more people have discovered that privilege over the last few years.

**Chuck Carpenter:** [44:27] Yeah.

**Dan Gebhardt:** [44:27] But yeah, used to be a lot more people commuting from here, say down to Boston, and I never really wanted to do that on the daily.

**Chuck Carpenter:** [44:36] Yeah, options are nice. Forced commute isn't so much, but that's nice. I used to go to Boston all the time because I worked for a company there called Acquia and so a few times a year go to Boston. And then I had teams I used to be an engineering manager for them, so I had teams in Toronto, too. So it's like Toronto, Boston all the time, just not in the winter. What do you do in the winter?

**Dan Gebhardt:** [45:01] We do like, snowshoeing and such and cross country skiing and just hiking and such. I kind of like the seasons. Grew up in the Northeast, so I feel home with the season, so I don't mind the cold. I just mind when winter starts to drag on a little bit. If I can get away in March or something, life is good.

**Robbie Wagner:** [45:23] Do you have a snow blower.

**Dan Gebhardt:** [45:24] I share one with a neighbor.

**Robbie Wagner:** [45:26] Nice. Just curious.

**Dan Gebhardt:** [45:31] Now we're getting really personal here.

**Chuck Carpenter:** [45:33] Yeah. I was going to say, what was that movie where it was like your mother was a snow blower? I don't know.

**Robbie Wagner:** [45:40] No, but that sounds like a fun movie.

**Chuck Carpenter:** [45:42] Yeah, I'll Google it, figure it out later. Post it on your Twitter.

**Robbie Wagner:** [45:46] We talked to Wes Bos a little bit about tractors, and he has a snow blower attachment on his and stuff. And I'm just into that stuff because we moved out to the country. So we have ten acres of land now and have to mow all the time. And it's way different than how life was before.

**Dan Gebhardt:** [46:04] Oh, wow. Yeah. Ten acres. That's a serious commitment. I hope you have some of it as wooded. Right?

**Robbie Wagner:** [46:11] No.

**Dan Gebhardt:** [46:12] You don't have to mow all ten acres, do you?

**Robbie Wagner:** [46:15] Some of it is like, big fields that I don't mow, but like a few times a year. But yeah, it all does have to be mowed at one point.

**Dan Gebhardt:** [46:25] Okay, so you've got some hay bales and such.

**Robbie Wagner:** [46:28] Yeah, essentially.

**Chuck Carpenter:** [46:31] Maybe I'm wrong. There was that movie Manchester by the Sea. Really sad casey Affleck movie was that? That's in New Hampshire, right? Manchester.

**Dan Gebhardt:** [46:41] There is a Manchester, New Hampshire, but Manchester by the Sea is that I actually have not seen that movie, so I don't know. I mean, Casey Affleck is like a Boston guy also. That's a good question. I guess I could look it up. But have you seen it?

**Chuck Carpenter:** [46:59] A little while ago. Yeah, but I didn't take it in from a geographical perspective. It just kind of triggered that. Oh, yeah, there was that. And he's from that kind of area. I think that was New Hampshire. I could be wrong. I could totally be off and making it up. It's possible to do that.

**Dan Gebhardt:** [47:17] Okay. But it was America, definitely not England.

**Chuck Carpenter:** [47:21] Yeah. No, it's the better Manchester, though. I don't know if you noticed my hat, but.

**Robbie Wagner:** [47:26] The United one.

**Chuck Carpenter:** [47:29] Yeah, I like that one. I've been there. I'm a fan.

**Robbie Wagner:** [47:33] So related. Caitlin and I watched the first two seasons of Ted Lasso, so I have watched a little bit of soccer-related things now.

**Chuck Carpenter:** [47:43] Yeah, you're basically a fan. Yeah. We'll go to a DC United game when I'm back next time.

**Robbie Wagner:** [47:50] I'm down.

**Dan Gebhardt:** [47:51] Nice.

**Robbie Wagner:** [47:51] I think anything is better than going to golf. That would just be too slow. As long as there's a little bit of action, I'm cool with it.

**Chuck Carpenter:** [48:00] There's plenty of action. And they have a nice field that I've not been to, so I used to live in DC. And basically, they were building that stadium and it was like near I was living in the Navy Yard so it was like not far from my house at all. And it opened that. So I think we moved, I don't know, in April, and it opened when the season started in August or something. I don't know. Yeah, it was so close. So I've not been. Suffice to say, I would like to go to Audi Field.

**Dan Gebhardt:** [48:28] Chuck is looking for an excuse, Robbie.

**Chuck Carpenter:** [48:30] Always excuses to get into things.

**Robbie Wagner:** [48:33] Hey, come fix the Internet in the office and we'll go.

**Chuck Carpenter:** [48:37] Perfect. Excuses to get into things excuses to get out of things. It's all an excuse.

**Robbie Wagner:** [48:44] It's what we all need.

**Robbie Wagner:** [48:46] All right, we're about at time here. Was there anything we missed, Dan, that you would like to bring up? Anything you'd like to plug? Anything like that?

**Dan Gebhardt:** [48:53] I would say that although JSON API itself probably seems fairly dormant, we're actually on the verge of a pretty exciting new release of version one one and add some new capabilities and adds a whole bunch of extensibility. So I'm excited to get that out. So basically, it provides a negotiation mechanism for extensions and profiles the ways to extend the spec or say how you're using the spec in a particular way, so in a more opinionated way. So there actually is news on that front, finally, after working through it over the years. So that's the thing I'm currently focused on most open source. I'm excited about that. And, yeah, I'll leave it at that.

**Robbie Wagner:** [49:41] Awesome.

**Chuck Carpenter:** [49:42] All right, cool.

**Chuck Carpenter:** [49:43] Yeah. So check out JSON API if you haven't recently. New cool stuff coming. Thanks for being on Dan, everyone that was listening, if you liked it, please subscribe and we'll catch you guys next time.

**Chuck Carpenter:** [49:57] Thanks for listening to Whiskey Web and Whatnot. This podcast is brought to you by Ship Shape and produced by Podcast Royale. If you like this episode, consider sharing it with a friend or two and leave us a rating, maybe a review. As long as it's good.

**Robbie Wagner:** [50:12] You can subscribe to future episodes on Apple, Spotify, or wherever you get your podcasts. For more info about Ship Shape and the show, check out our website at shipshape.io.
