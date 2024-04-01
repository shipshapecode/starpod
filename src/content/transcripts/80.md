**Robbie Wagner:** [00:09] Welcome to another edition of Whiskey Web and Whatnot with myself, Robert William Wagner, and my co-host, as always, Charles William Carpenter III. With our guest today, Fred K. Schott. What's going on Fred?

**Fred Schott:** [00:25] Not much. Thanks for having me on. Excited to be here.

**Robbie Wagner:** [00:28] Yeah, thanks for coming on.

**Chuck Carpenter:** [00:30] Cool. Great to have you. You are the CEO of HTML, which is one of the greatest titles of the internet. I know that Robbie really respects that.

**Fred Schott:** [00:38] Yeah, that'll be coming up in our quarterly performance review, but thank you. I appreciate the kind words.

**Chuck Carpenter:** [00:43] Yeah. How are you doing with HTML these days? It feels like it's performing better. Maybe some new things in the spec. Who knows?

**Fred Schott:** [00:49] Yeah.

**Chuck Carpenter:** [00:50] But you share this title with another gentleman on Twitter who has a slightly different career trajectory, though.

**Fred Schott:** [00:56] So every once in a while, I'll get tweets being like, I heard someone's coming for the title, and it'll be, like, a totally different tweet by someone be like, oh, I guess I should be the CEO of HTML. I have, like, an army of people defending my right, like an heir to the throne of HTML.

**Robbie Wagner:** [01:10] Yeah. Are you talking about Jack Forge?

**Chuck Carpenter:** [01:12] Yes. And he does sites for entertainers of all types.

**Robbie Wagner:** [01:18] Yes.

**Fred Schott:** [01:20] Oh.

**Robbie Wagner:** [01:20] So apparently, you didn't dig into this, okay.

**Fred Schott:** [01:22] No.

**Robbie Wagner:** [01:23] He was listed as CEO of HTML as well, and then he posted a tweet or something that was like, I have some bad news. I was demoted from CEO of HTML or something like that.

**Fred Schott:** [01:34] I actually did see that. I didn't realize I didn't connect who that was. But there's a hostile takeover, and the board installed me as a new CEO, so I'm happy to serve.

**Chuck Carpenter:** [01:43] Yeah, you're doing different things with it, and much to the chagrin of many adult entertainers.

**Fred Schott:** [01:50] That's funny. I didn't know that was their background.

**Chuck Carpenter:** [01:52] Yeah. Well, the world is a small place. Aside from those things. Fred, tell us a little about yourself.

**Fred Schott:** [01:59] Yeah. Besides working with HTML, I helped create the Astro Web framework, which just hit its 2.0 launch. It's a way to build websites, which I'm sure we'll get into, but it's a really cool newer project, kind of antidote to some of the trends of the last decade. That has been a lot of fun to explore with the team we've created.

**Robbie Wagner:** [02:16] Nice.

**Chuck Carpenter:** [02:18] I think in many ways, the Astro and the work you're doing are becoming kind of the bastions of HTML, obviously, many other things going along with it, but saying HTML is a first-class citizen, I highly respect, and then seeing what we can do with these, like, base building blocks of the internet.

**Fred Schott:** [02:35] Yeah. Someone once described Astro as they described Astro as the first web framework that's HTML first without hating developers for not using HTML, and I always resonated with that. I think there's been a lot to do it before. We're not the first, certainly, and I think a lot of our best ideas were riffs or outright taken from other projects, and we're trying to fit them together in a new way. But it's all coming from a place of trying to match the dev experience of all the modern tools that you're kind of familiar with. So it's not like sacrifice and use HTML. It's much more like, look how cool this could be if you use HTML. So there's a couple of people. There's always the snark. There's always the haters out there. But I think we struck a really good balance. And, yeah, we really love HTML. We think we are enhancing it, not bastardizing it.

**Chuck Carpenter:** [03:18] Very much agree with that. But before we get too serious, I think we should talk about the whiskey because we need the social lubrication, so we don't take ourselves so seriously.

**Fred Schott:** [03:26] I don't mean to be so bold to interrupt this intro, but I just. How would you describe this podcast to someone who doesn't know it? Because I described it to my family as, like, Hot Ones for tech podcasts and featuring alcohol. Have you ever used that before? That's the best I could come up with. I didn't know how much I missed the mark.

**Robbie Wagner:** [03:43] Chuck would love that.

**Chuck Carpenter:** [03:45] No, but you've given me so many warm and fuzzies on the inside. I'm not sure if you got some insider information, but I love Hot Ones. I'm so obsessed with that show.

**Fred Schott:** [03:54] Who doesn't? It's the best.

**Chuck Carpenter:** [03:55] Right? Yeah. And I've done a challenge at home with some friends. Not necessarily recommended, but it is interesting. So I think the way we've, like, our elevator pitch has been like a fireside chat with your favorite devs and the fireside fueled by whiskey.

**Fred Schott:** [04:13] I see this as a threat of trying to walk the line between participating and not getting too drunk. And I'm a bigger guy, so I think I'm going to be okay here. I don't think we're going to exit at the Fifth Wing or anything like that.

**Chuck Carpenter:** [04:24] Right.

**Fred Schott:** [04:24] I can imagine how this would actually be pretty tight for pretty hard for someone who I don't know. There's a challenge to it, which I kind of enjoy.

**Chuck Carpenter:** [04:31] Yeah, there's definitely a few folks that have gotten a little lubed up and slurred their words and whatever else. That's totally fine.

**Robbie Wagner:** [04:37] Makes it fun.

**Chuck Carpenter:** [04:38] Except for Kent C. Dodds. Right. Because it turns out non-alcoholic eggnog doesn't really do that for you. So we got the full Remix pitch.

**Fred Schott:** [04:45] Just get bloated, I would imagine, right?

**Chuck Carpenter:** [04:46] Yeah, right?

**Fred Schott:** [04:47] A little bloated, a little sleepy.

**Chuck Carpenter:** [04:49] Yes, exactly. And just dreaming of Christmas. That's all I was through that whole interview. Sorry, Kent. I mean, Remix is very cool, but I need booze.

**Robbie Wagner:** [04:58] He's not with Remix anymore, so.

**Chuck Carpenter:** [05:00] I know. Yeah, he's doing his own thing.

**Robbie Wagner:** [05:02] Your videos and stuff. Really cool.

**Chuck Carpenter:** [05:04] There you go. That, too. I learned so much.

**Fred Schott:** [05:07] He's the OG. He's the goat.

**Chuck Carpenter:** [05:09] Yeah, right? Oh, Pinhook. That's what we're doing. So we're doing a Pinhook Artist Series, blended whiskey. And this particular one is Whiskey Nicking. Is the art on the back by Nicholas Blackman. I don't know. I'm sure I said that wrong. But it is a blend of bourbon and rye whiskeys distilled at the Castle and Key Distillery, which I think is super cool because it's, like, one of the oldest original distilleries in the United States. It was created by Colonel Taylor, so it's called the Old Taylor Distillery originally in, like, 1887. And Colonel Taylor is like a brand that Buffalo Trace releases now, but originally they used to be, like, their own standalone distillery, and now they got the distillery is restored, like, I don't know, eight years ago or so, fully up and running and distilling their own stuff. So this is juice from there, 112 proof, and it's aged at least three years. I think that's probably because ryes can be less aged than bourbons.

**Fred Schott:** [06:09] So I don't know much about whiskey bourbon, really. I'm a pretty novice. I'm too embarrassed to repeat what I said to you all, but I'm a novice. What I did say, though, before we met is this is a bottle that is very pretty on the front but has, like, a lot of personality on the back, and I appreciate that. I feel like they go too far sometimes. Here's, like, a cool new hip bottle from some cool new hip distiller, but then the front's got a little bit of class to it. I like that.

**Chuck Carpenter:** [06:33] Yeah, dig, that chef's kiss is what I think you would say. Yeah, this is kind of a cool little artsy thing. And there's always, like, a horse motif to it. I think it's like different racehorses and stuff on their normal ones. And they do the wax dipping, which, other than Makers Mark, a lot of places aren't doing anymore. Has a good smell, like a.

**Fred Schott:** [06:50] Maker's Mark. That's plastic that, right? That kind of red top that they put on there?

**Chuck Carpenter:** [06:54] No, it's wax. I've been to the distillery. You can actually dip your own bottles.

**Fred Schott:** [06:57] Oh, nice.

**Chuck Carpenter:** [06:58] Yeah.

**Fred Schott:** [06:59] Whoa. Very cool.

**Chuck Carpenter:** [07:00] Yeah. See?

**Fred Schott:** [07:01] Okay.

**Chuck Carpenter:** [07:02] It's a beautiful property. And they have, like, some Jolie, like, glass sculptures, too, in the rick house, as you're, like, leaving the edge of the initial rick house. And just the whole property was designed by the family originally in the 50s. Yeah, pretty neat.

**Fred Schott:** [07:15] Oh, that's cool.

**Chuck Carpenter:** [07:18] I smell butterscotch.

**Fred Schott:** [07:20] Yeah. I'm literally just going to watch you guys and then do what you do, like.

**Chuck Carpenter:** [07:23] Okay.

**Chuck Carpenter:** [07:24] Yeah, yeah. No, I'm glad that we have fooled you. If you just make up words and it sounds like you know what you're talking about, people believe you. That's basically been 20 years of my dev career, so.

**Robbie Wagner:** [07:35] Just think outside of the box. Like, don't go for the oaky nutty, whatever. Like, I think this smells like cacio e pepe to me. Little bit of parmesan with some pepper, I think.

**Chuck Carpenter:** [07:48] I don't think he means this. I think he's no. I'm doing this out of nowhere. I love cacio e pepe.

**Fred Schott:** [07:53] No. Now it's a challenge. See, now that you said I can make up words, but it's going to be real. I'm going to get something very real here. Give me 1 second. Crayons. Crayola. Crayons.

**Chuck Carpenter:** [08:03] Okay. What color?

**Fred Schott:** [08:06] Blurple?

**Chuck Carpenter:** [08:06] Does it matter?

**Robbie Wagner:** [08:07] Did they smell different?

**Chuck Carpenter:** [08:12] Yeah. Now, okay, so I got some butterscotch in, smelling it with a little bit of like, I don't know, what would you say? Like, what am I thinking? Like, not a fresh-cut lawn or something like that, but I don't know, I'll think of that. It's got, like, kind of an outdoorsy bit to it.

**Robbie Wagner:** [08:30] It tastes a little bit of barnyardy. Yeah, I don't know the.

**Chuck Carpenter:** [08:34] Like hay.

**Robbie Wagner:** [08:35] Like, hay, yeah, maybe like, hay.

**Chuck Carpenter:** [08:37] Maybe like, hay, smell of hay. That's what I'm thinking.

**Fred Schott:** [08:39] Oh, yeah, definitely. Yeah, me too. Me too.

**Chuck Carpenter:** [08:42] But I do taste a little creme brulee, like a little burnt sugar kind of when I taste it.

**Fred Schott:** [08:47] That is spot on. That I actually do pick up.

**Chuck Carpenter:** [08:52] I just drink a lot, Fred. Or should I call you Pred? It's a story I'll have to get.

**Fred Schott:** [08:57] Into later about the first time you've called me Bread, and I don't know what that means.

**Chuck Carpenter:** [09:00] No Pred with a P, so it's Fred.

**Fred Schott:** [09:03] Oh, Pred.

**Chuck Carpenter:** [09:03] But then you pronounce it Pred because in some languages, they don't have an F sound. And so if there is an F, they pronounce it P. Pred. I'll explain that later. And whatnot because it's a long story and too weird for right now.

**Fred Schott:** [09:18] So what's my goal here? Am I supposed to be drinking this whole bottle by the end of the podcast? I'm going to try and pace myself, so I'll know.

**Chuck Carpenter:** [09:25] Yes, that is exactly what you're supposed to be doing.

**Fred Schott:** [09:28] That's the last tab you just chug.

**Chuck Carpenter:** [09:30] You did say you're a big guy. If that's what you need. Every level. I am not a large person, but I do frequent the brown juice, so we could be on par with one another, possibly. I couldn't drink this whole thing in an hour and adequately walk out of here. So if you can make it upstairs to bed when this is done, you should go for that.

**Fred Schott:** [09:53] I think I got some PRs to review after this, so yeah, that's absolutely not my goal.

**Chuck Carpenter:** [09:57] Yeah, perfect. I can't wait to see what new features make Astro.

**Robbie Wagner:** [10:02] Astro 3 is a little sloppier than Astro 2. It's a little weird. No, React support. Must have been Robbie that got a PR in last. And all of a sudden, Ember is in. I don't know what happened. Turned out or Glimmer or something. Okay, so, yeah, we talk a little bit about this whiskey. The flavors we're picking up, kind of whether we like it or not, we have a highly technical system of rating it's one through eight, one to eight tentacles. Haha, clever branding.

**Fred Schott:** [10:34] Haha.

**Chuck Carpenter:** [10:34] One being the worst thing you've ever had. I don't want this anymore. Eight being the greatest thing you've ever had, please give me nothing else. And everything kind of in between. So four isn't bad. Four is average for you, whatever baseline you want to put into that. And you said you don't drink a ton of whiskey, so just whiskeys in general. Think about every whiskey you've ever had and what you've enjoyed and what you haven't, and kind of just pit it against that for me. Since this is a blend of bourbon and rye, I'll just think of it more as like just American whiskey and consider it against those. And if it makes it any easier, I'll just do go me first to influence you and the rest of your decisions in life.

**Fred Schott:** [11:09] Yeah, I was going to say it would be both cruel, and the only accurate way to do this would be if I go first. But I'd much rather prefer to hear you all.

**Chuck Carpenter:** [11:19] I also consider price sometimes, too, because if it's not that great or it's not bad but doesn't stand out to me. But then it was like an $80 or $100 bottle of whiskey. It's just like, oh, well, there are things I prefer that are $30. And so why would I ever pit this up higher than that where there's just no value there? I do think this is pretty tasty and interesting. Enjoying it. Enjoying the look of the bottle. It's kind of neat. You could share it with friends, socializing. So six and a half. It feels better than a six to me. Doesn't quite feel like full seven. So I think I'm going to say six and a half.

**Robbie Wagner:** [11:54] Yeah.

**Chuck Carpenter:** [11:54] I enjoy it, and I would definitely share it with friends.

**Robbie Wagner:** [11:56] Yeah, that's kind of where I was at, too. I was thinking six, but I could come up to seven, maybe. Yeah. So we'll just say six and a half for me, too, I guess.

**Fred Schott:** [12:07] Okay, so half points are allowed. Okay.

**Chuck Carpenter:** [12:09] Yeah. Well, it's been a recent addition where some, I think Robbie really kind of introduced it, and I tried to push back a little bit, and I gave up. As with most things.

**Fred Schott:** [12:21] I was leaning between a six and a seven. I promise. I think I'm going seven because I'm a noob, but I have had some good whiskey before, and this really is hit the spot for me. Very smooth. So given a stamp of seven, I might even gone an eight. But I know that's like a suckers thing to do on your first pod. I'm sure the rating is a little bit more professional here.

**Chuck Carpenter:** [12:40] Well, let's be honest, you're a pod professional because sometimes they'll do a little research here and there. We try to play this mostly by ear, but I'll go and listen to some other podcasts that our guests have been on because I don't want to barrage you with the same bullcrap that you talk to everyone else about. There's certain things within our community that's, like, very well treaded. So why do we want to talk about them again? It's clear people haven't if they're listening to this and they've heard you on any other podcast. They know what islands are. Right. They have an idea of what Astro does and can do and what can champion. Obviously, with the release of 2 recently, that's starting to grow, and I think there's a lot of potential in where it can go even beyond that. But I don't want to repeat myself a bunch, or you to repeat yourself a bunch? Sorry. In that, you've been on some other podcasts that are just more technically focused, and this one's supposed to be a little more casual.

**Fred Schott:** [13:29] I like that. It's always tough to walk that line between I've seen this more like this, not debate, but on live streams, it's like, do I want to do coding? Because I have a screen, I can use it, I can open up some code, or do I just want to talk about the project, or do I want to talk about this person's history? And there's a ton of different ways. Yeah. Everyone has something. This is the first time I've drank alcohol on a podcast, so I think you're already off to a good kind of unique start here.

**Chuck Carpenter:** [13:52] Yeah. This is it, though. It's all downhill.

**Fred Schott:** [13:56] Yeah. It's actually a crutch. Yeah. Get everyone drunk, and everyone thinks they have a good time.

**Chuck Carpenter:** [14:02] Yeah, exactly. We encourage that of our listeners, too.

**Robbie Wagner:** [14:05] To get drunk and have a good time.

**Fred Schott:** [14:07] Do you get listeners kind of writing in being like, do you like to share the alcohol you're drinking ahead of time? Is there any way to participate? You have to listen and then stop, go out, and get it.

**Chuck Carpenter:** [14:17] That's a great suggestion.

**Robbie Wagner:** [14:19] Well, yeah, if you weren't listening to it immediately when it came out, you could check the show notes, see what we drank and go buy it. But yeah, I guess maybe we could announce it ahead of time.

**Fred Schott:** [14:31] I bet someone's done this. I bet if you ask your audience, someone has done this somewhere out there.

**Chuck Carpenter:** [14:35] Yeah, I think we should ask that question. So it's funny because a couple of other folks from Astro have been on, and yeah, I wonder, like, if they listen to other episodes and if they have decided to, like, participate along with it. I'll have to ask that.

**Fred Schott:** [14:51] So you had Dan on.

**Chuck Carpenter:** [14:53] And Nate.

**Fred Schott:** [14:54] And Nate. Okay. Nice.

**Chuck Carpenter:** [14:55] Yeah. Yeah. Although Ben's, like, probably too famous for us now. I mean, technically, you're probably too famous for us now, but you committed early.

**Fred Schott:** [15:03] Ben's too famous for all of us. Yeah. Once you have a once you have a YouTube channel with shorts, I feel like then you're just blown past everyone.

**Chuck Carpenter:** [15:10] Yeah. That's an interesting thing. That's, like, quite a phenomenon that I feel has accelerated quite a bit. Like, live coding streams and YouTube channels to teach development. I do feel like that's, like, accelerated a lot. And the people that are good at it are really good at it. Like, Ben, for example, also, like, really great at it. Like the Primagen, like, really great at I don't know. He'll just approach a concept, and it just feels so empathetic and interesting. And then also, you can't get his voice out of your head. So people that are, like, leaned in are doing well. They are doing really well.

**Fred Schott:** [15:45] Yeah, it's a funny format in that it rewards. So Ben, one of my favorite things Ben used to do is it was just a whiteboard, right? Like, him in front of a whiteboard, which already it's so clever just to do that. And that's the bit. Who uses a whiteboard? You never see that anymore. It's all green screens. He's got the whiteboard unique. Very cool. I love it. But then he used to animate the whiteboard by literally, like, frame snapshot, go erase it, do something new. Snapshot, erase it. And he would create these, like, pretty advanced animations. There's no way that was worth the time investment, but it was so unique, and only someone like Ben could do that. And there's no way to do that at scale. You can kind of find these, like, really creative, expressive ways to, I don't know. It was really fun watching him try those things out and just like, oh, I've never seen anyone do that across TikTok YouTube anywhere.

**Robbie Wagner:** [16:32] Yeah, he just needs to build some whiteboard AI that can do that for him. And then you don't have to worry about it.

**Chuck Carpenter:** [16:39] Integrate stable diffusion or whatever and have it just start creating that for you. You build the model and then that sounds like some pretty smart stuff that I don't have time for. I'm busy drinking and doing podcasts.

**Fred Schott:** [16:51] So I'm one of those weird people who actually go to YouTube. I open up my YouTube app and browse it, which I feel like I tell people that, and they're horrified. They don't know what that means. I'll browse it and push shorts. You can tell that there are algorithms out there that just take a movie or a show or something, slice it into literally just slice, slice, slice, slice 1000 clips out of one movie. Publish them all, and then whichever ones do well, those are the ones that matter. The ones that don't kill them off. And no human had to be involved in that at all. That's my theory of what's going on because some clips make no sense. It starts in the middle of one scene and then the end of another. It's all very odd, and it feels very weird and robotic. But, hey, you can just pump that out, click a button.

**Chuck Carpenter:** [17:30] Oh, yeah. I definitely think there are some script-generated content and some, like, weird AI-generated content. I've definitely had. I'm not sure if you have children or not. I have a couple of small kids, and it's amazing that sometimes when they can't read that they can still find the craziest content on YouTube, and they'll sneak into YouTube. They know how to get to YouTube and start to find things. Even if you try to block all these things off and then you'll just see some weird like it looks like computer-created content that is on there, and they're just like probably just feed something in real quick. Spit it out, see if it gets a bunch of views or not, and just rinse, repeat, and try to pitch it to kids who don't know any better.

**Fred Schott:** [18:09] There's a couple of those where it'll be like a three-hour dancing Ironman video, and it's like a 3D generated Iron Man dancing 10 million views, and it makes no sense for 3 hours. You just must put this in front of a kid, and they watch it. It must be great. They must love it.

**Chuck Carpenter:** [18:26] Also, who are you if you let your kid watch 3 hours of dancing Iron Man? I don't know if you need it. I guess.

**Fred Schott:** [18:32] I just had an eight-hour car trip. I would have put anything on with my two-year-old daughter.

**Chuck Carpenter:** [18:37] Oh, nice. Okay. Yeah, I mean, that is our iPad time, so they can earn it on the weekends, and then obviously, any long trips where like load them up with movies and games. Enjoy. Go nuts. You're not on the internet, so you're not going to find weird YouTube stuff. But yeah, that's the only thing that helps.

**Fred Schott:** [18:53] That's what you think. They've already secretly bought a SIM card. They're loading it up.

**Chuck Carpenter:** [18:57] Right. Exactly.

**Fred Schott:** [18:59] Dancing Iron Man all day.

**Chuck Carpenter:** [19:00] Exactly. They set up a hotspot on a Raspberry Pi and put it in the back of the car. We don't even know it's possible. Cool. So yes, Astro, but there were some Astro things we were going to talk about, so we should probably get into that a little bit. Simple stuff around V2. And yes, unfortunately, we haven't updated our site into V2 yet, but I am interested to dig into some things.

**Robbie Wagner:** [19:22] Yes, we have.

**Chuck Carpenter:** [19:23] Have we? You did it.

**Robbie Wagner:** [19:25] Yeah. It didn't have any breaking changes for us that I know of.

**Chuck Carpenter:** [19:29] Did we introduce any type safety in our content?

**Robbie Wagner:** [19:32] No, of course not.

**Chuck Carpenter:** [19:33] Okay.

**Robbie Wagner:** [19:33] That would take work.

**Chuck Carpenter:** [19:34] So we're not using the new features yet. That's what I'm getting at.

**Robbie Wagner:** [19:38] No, we do need to do that.

**Chuck Carpenter:** [19:39] Let's look at some of the new features. Yes, we can change the package file and say we're on V2. I mean, we're bleeding edge.

**Robbie Wagner:** [19:47] That's what I did.

**Chuck Carpenter:** [19:47] We have got, like, I think, one small SolidJS component in our site, but I means it's a pretty static site that's around like.

**Fred Schott:** [19:53] Oh, cool.

**Chuck Carpenter:** [19:54] Yeah, it's just like the contact form, right, or something. Yeah.

**Robbie Wagner:** [19:58] Just because it needed to, like, show error states and be a little dynamic.

**Fred Schott:** [20:02] Yeah, forms are sneaky complicated. Like maybe not that sneaky, but they're like, that's one thing. Everyone's like, when are you going to release the Astro form component? Yeah, but how much of that is like? You really want React or Svelte or Solid, whoever, to do that? A server-side form with no client-side code is like pretty rough.

**Chuck Carpenter:** [20:18] Maybe, but I saw Adam put out a thing a couple of weeks ago about full-form validation using just HTML and tailwind, first of all. So your form validation now no longer needs these DOM interceptors and event watchers and stuff.

**Fred Schott:** [20:35] Interesting.

**Robbie Wagner:** [20:36] How does it know what's valid, though?

**Chuck Carpenter:** [20:38] By input type if it's invalid by the HTML and then some weird crazy million whatever state things that he can do in Tailwind? I don't know. I thought was pretty cool. I can't say I understood it, but I just looked at the demo, and I was like, wow, this is cool. And then, yeah, obviously, sending off your event to the server, you could do that. I don't know. I know some people think it's 90-style web, but it was a version of the web that was very scalable and worked too. So do you need the flashy smooth transitions, or do you need something that works at scale with a million concurrent connections? Like, I'm going to deal with the latter if you have to. In most like enterprise situations, that is why HTML wins.

**Robbie Wagner:** [21:25] Yeah, I do think it's weird when the page has to go to a different page or refresh basically to post to the server instead of like you're used to getting a little toast that's like thank you or whatever. Not like a full reload.

**Fred Schott:** [21:38] Or even just validation like as you type. I'm a sucker for the password that turns green as you go. Let's do this character. Must have the special character.

**Chuck Carpenter:** [21:47] Yeah, I love the sugar. I'm all about it. I'm just saying you don't need it.

**Fred Schott:** [21:51] Yeah, there's a little sweetness, little sweet UI in your life.

**Chuck Carpenter:** [21:53] Yeah, you don't need it. But it's nice, and it's good, and it makes people give some people warm and fuzzy, and it's early user feedback and all that kind of stuff. I dig those things. It's just I love that it's not really a requirement. Like you said. People are asking when are you going to get whatever functionality for a contact form. It's sort of like, well, I mean, you don't need it. It is not like an emergency release that you need to do. There's different ways around it, and there's the idea of like progressive enhancement again, which I like.

**Fred Schott:** [22:25] Yeah, I think Ryan Carniato on the Solid team has done some really cool. What if you took over the form submission? Like the action, like where it submits to, could all be handled invisibly but still build the front end and a component so it can have that interactivity. So today in Astro, you got to create an API endpoint that handles the form and make sure that it kind of hooks it up properly if you want that dynamic, more API-based form versus a full submit 90s-style submit. But Ryan's been doing some really cool stuff. What if even that connection to an API felt more like a function call without having to set up a full endpoint yourself? And that's really cool to me.

**Chuck Carpenter:** [23:01] Yeah, I agree with that. Like, sort of blur those lines, at least, and everything is sort of agnostic to the user. It's funny. You bring up Solid JS, I think, a couple of times. I did the first one, but I know that Robbie here is becoming a bit of a Solid fanboy around its state management and what have you said? It's like a form of React that you can actually live with.

**Robbie Wagner:** [23:25] Okay, so I've talked about this a lot on the podcast.

**Chuck Carpenter:** [23:28] I put him on blast here a little bit. It's funny.

**Robbie Wagner:** [23:31] But my problem with React is not that it's like the world's worst library. It's that everyone blindly uses it because it's the hotness, and everyone is supposed to use it. Like when we had Josh Collinsworth on about his article about the only thing React is good at is being popular or whatever, I agree with that. I think people are like, oh, Facebook made this, so it must be good. Let me just use it and learn it blindly because everyone's using it, and every job requires it. And I think Solid kind of bridges the gap of, like, okay, this is the same syntax that 99% of you just learned for React, but we took away all the shittiness of needing to use all these hooks, and you can just create a signal that's like, oh, this thing might update update when it updates. There you go. It just has an easier mental model that, for me, is closer to the way Ember's, like auto-tracked properties and stuff, work. So, yes, I can live with it.

**Chuck Carpenter:** [24:29] Right. I mean to me, it was always like I feel like there's a point where it sort of jumped the shark in that it was created as a library to dynamically show content and have that update on the fly easily right in context. And then it's been due to popularity and demand. It's been pushed kind of to the edge of its potential capabilities. And I think that the really smart people behind it have found some clever ways to wedge that around. And then I think that some of the actual frameworks that decided to put some rules around it made some smart choices there to kind of make it work. But at the end of the day, it was always intended in one particular way, and then it's always been, like, kind of evolved to try to make it be a one-stop shop for all these other kinds of things. And that maybe is one of the fallacies, and it's sort of like you embrace that, and that's fine, and you go down the path, and it resonates with you. But it's more than one way to skin a cat, they say. And that's maybe not a politically correct thing to say. So cats are no longer going to listen.

**Fred Schott:** [25:36] Peta is going to be all over you.

**Chuck Carpenter:** [25:37] Yeah, Peta is never going to listen to this podcast again. Cats are going to ban me.

**Robbie Wagner:** [25:42] Cats against Chuck.

**Chuck Carpenter:** [25:43] That's okay because cats try to kill me. I'm severely allergic, so I hate them anyway. Skin them all.

**Fred Schott:** [25:48] Me too. I don't know about hate, but I definitely am allergic.

**Chuck Carpenter:** [25:51] Yeah, it's true. I don't hate. I don't actually hate any animal or wish it ill will in that sense. Just like don't live with me and stay away.

**Fred Schott:** [25:59] So I would actually say I'm probably surprisingly a React fan here. It's what I learned, what I would call this new wave of modern window. I was never a Vue, never a Svelte like React was for me for a long time. Yeah, I mean, I think you can't talk about React without talking about where the web was at that point. I was working on a mobile site at the time that had to do PHP template rendering that then hydrated. You use iQuery basically to wire up things. And then, you had to re-implement that exact same template for a local comment to work. So you make a comment, you wanted to progressively kind of give you your comment, and then the server is going to behind the scenes go and submit it. We had a template in two different code bases, two different languages just to try like it was a mess, and that's the world that React kind of saved us from. Now what always happens is that people take that and they say, oh, JavaScript, let's put if React solved this problem, it must solve this other problem and this other problem. And all of a sudden, you have your CSS is actually a JSON object, and you've done too much. You've gone too far. And I think that's where we're at now. But I will forever stan React. I'm always a big fan. I think they've gone too far. And React itself now is very large, which is interesting because it's taken us away from that. Like, but islands is essentially that old-school idea of hydrate parts of your site. The comment will get hydrated, but the rest of your site can be server generated. And that's something they're now having to kind of circle back to through the server components idea. But ultimately, they're coming at it with that SPA mindset that we own the full app. So Facebook doesn't care that React weighs 50 KB because it's all React at the end of the day, just put it on React, and it's going to be okay. But for islands or for anyone who's kind of using it more incrementally or doesn't need the full weight of it. It ends up being this giant thing that, for your first island, you have to download all this React code just to run it. And that feels like they lost their way a bit from that early goal, that early design.

**Chuck Carpenter:** [27:51] Yeah, I don't disagree at all, actually. And contrary to maybe how it particularly sounds, I'm not anti-React. I just don't think it's always the best tool for the job. And perhaps it paved the way for a lot of forward momentum. And now, some other tools have a similar but yet dissimilar take that give you a different option that might be better. So it doesn't necessarily mean that is bad. It was a great tool for the job. I was going to say the first time I actually deployed the first React component for National Geographic that would have been used by millions of people logging into the National Geographic site across a bunch of the properties. And I had come off of a highly complex backbone marionette project, which was like our solution to not dealing with jQuery spaghetti. And we were like, oh, here's something that lets us do some of these things, and that gives us a structure or a set of rules, and then we can kind of create a whole app around it. But then we were like, oh my gosh, we're essentially like writing MVC applications on the front, and it feels like a lot. How can I just make one thing more dynamic than that? Like you said, the article comes from the server, gets rendered up, and then now we need dynamic identity. Cool. Let's make that this like cool React thing. And I was so jazzed by the fact that you could go from logged into your identity without a server refresh and have this cool little setup thing there, and then you go from that. It's just that, like I said, I think they were popular, and there was a lot of demand, and then everything becomes a component. Your router is a component, and your state is other. I don't know. So it gets conflated along the way. But I would never say that I necessarily dislike it necessarily, but I just wouldn't always feel like it's the best option always along the way. And like you said, in an Astro world, it kind of can regress to its greatest strengths in a way, and no problem using it in that way because you're just serving HTML, and then you're giving the user one little dynamic bit at a time. So if you like React for that, great. Go for it.

**Fred Schott:** [30:03] Yeah. I can't remember if the Solid team ever ended up using this, but this idea that Solid is the way you thought React worked when you first picked it up. There's always a tagline I loved, like, wait, what do you mean? This function is going to run multiple times, and the hook is somehow going to prevent that. But what closures are what now and then Solid is like, no, no, no, no. This is the mental model you actually have. And I always like that. I don't know if they ever want, but that's a cool tagline.

**Chuck Carpenter:** [30:25] I feel like I've read that at least a couple of different times. Like, this is the natural progression of React that you expected or something. We have to rename this podcast to React bashing and defending or something?

**Fred Schott:** [30:38] No. The Ryan Carniato fan club. That's what I'll be the I'll be the CEO of the Ryan Carniato Fan club. I'm going to go update my bio.

**Chuck Carpenter:** [30:45] Nice. We'll switch that up. Yeah, maybe if you got some inside. If he likes whiskey, he can come talk about those things with us.

**Fred Schott:** [30:52] I'll let him know.

**Chuck Carpenter:** [30:53] Cool. What do you got, Robbie? What do you want to talk about? I don't know.

**Robbie Wagner:** [30:57] I mean, we should give Fred a chance. If you have anything you want to specifically mention about Astro V2, I know Chuck doesn't want you to repeat yourself because might have been on other podcasts and said a lot about all this or whatever, but if you want to just kind of give, like a quick rundown of we don't want to monopolize everything thing by what we want to talk about. So if there are things, you want to get out in the.

**Fred Schott:** [31:19] Hey, you're the.

**Robbie Wagner:** [31:20] Just go for it.

**Fred Schott:** [31:21] You're the host. I'm here for the whiskey. I'm here for the nice bottle you sent me.

**Robbie Wagner:** [31:24] Okay.

**Fred Schott:** [31:25] I'm putting my time, and I'm going to go chug this thing.

**Chuck Carpenter:** [31:28] Exactly. I'm going to finish it before he gets upstairs.

**Fred Schott:** [31:32] What to talk about? I mean to talk a bit about Astro. I will repeat myself because I like talking about Astro. It's my favorite thing to talk about. What makes us unique is our content focus. So you talked about, like, you have one solid component that's a form and otherwise a mainly static site. That's exactly where Astro shines. So the idea that traditionally if you're building the SPA, you're going to send a full JavaScript application to power that mostly static site just because you need that one form component is bonkers to me. And Astro rebuilt specifically with that use case in mind of this doesn't need to send a React app to render what is essentially HTML. What we should have is a tool that is HTML first but still lets you bring in your React component, your solid component, whatever you end up liking for those one-off use case, the form, the search bar, whatever that looks like. So that's the world. That's kind of the problem that we exist to solve. And from there, we've kind of just realized that there is so much room to explore in terms of what a web framework looks like when you go back to this principle. So island architecture is the name of this term. This idea of thinking of your site as islands of interactivity versus one big JavaScript app. And there's so much cool stuff you can do with that that we're just starting to scratch the surface on. Asterisk 2.0 is really like bringing in some really cool features around Typesafe Markdown around hybrid rendering. But really, the architecture, I think, is what is kind of finalizing and formalizing here is that this is an alternative to, again, Next.js, Svelte Kit, Nuxt to Gatsby, pretty much every major project before us. We are very much a paradigm shift in the architecture of that site. And there's some great pros, some trade-offs to be aware of, but it's all really designed to optimize for that content-focused site.

**Chuck Carpenter:** [33:05] Yeah, what I love about it in comparison to some of those is that it is kind of a bring-your-own library ideology. First of all, and one of the things you mentioned on JS Party that I thought was really interesting, that really is like a concept that kind of helps you stand out out from something.

**Fred Schott:** [33:20] I knew you're a Hot One's fan because you're doing the thing that he always does, which is so I talked to your high school best friend, and he said that you once said this and what do you think about that? I love that you've done your homework. I'm sorry I ruined your question. I just had to say that.

**Chuck Carpenter:** [33:31] Oh, no, that's okay. I would have done it anyway. It would have ruined my own question. So, yeah, listen to that episode. And one of the points that you bring up there that really starts to bring up the idea of because I remember early on thinking about Astro in the sense of more of a Gatsby competitor, that you're talking about static site generation with maybe a little sprinkle of something on there. But actually, the potential is so much larger when you talk about micro front ends architecture, right? And this could be an outlet into micro front ends architecture because, essentially, one page versus another page can be two completely SPAs. And you can have your initial, like, come to a login page, and then based on a role. You go down one path or another. Or, based on a route, you could, like, dip into a React app over here and a Solid app over here. Because two different teams have chosen a completely different pathway, but they're all using the same tooling. And, like, efficiencies. So that's pretty cool. I thought that was really interesting and kind of opened my eyes. I'm not that creative, but I definitely think that Astro has a lot of potential in terms of clever use cases along the way.

**Chuck Carpenter:** [34:39] And I saw that as, like, oh, yeah, that makes total sense to me. I can see where that's an easy, really fast, great, useful use case there.

**Fred Schott:** [34:48] Yeah, we don't talk about micro front ends enough because it's a very polarizing tech. We don't want people to think of Astro as a micro front ends framework because some people love that. And then a lot of people are like. I don't like that thing. I don't know what it is, but I don't like it. My temperature check on the industry is like, very polarizing. Not something we necessarily want to tie ourselves to, but that's kind of the secret, is like, it's perfect for that. Yeah, everything we do, islands, architecture, the islands are micro front ends. It's very much a micro front ends architecture that we've kind of, I guess, in that world, then rebranded and taken away some of that rough edge of what it means because I think people think that it means something very opinionated, very holistic, but really it's kind of invisible in Astro's world.

**Chuck Carpenter:** [35:30] It's interesting within the JavaScript community in particular, where people have chosen their favorite team, as in their favorite framework, as their favorite team. Like, what do you mean you Svelte like, that sucks. Next.js is awesome because blah, blah, blah, I'm so productive, and it's fine. It's sort of like the best tool for the job. And letting teams within, like, an enterprise organization, work within their comfort space without infringing upon the entire organization. That is the great fit that micro front ends could play into. You could have this cross-department integration with micro front ends, but it was always like the how it was like the pain in the ass. It's like, do you have to have a third-party thing that you have to bespoke create to knit these things together? Or there's been a few attempts along the way, but if you have something that already is just like, we don't care, bring your own. And then there's an easy outlet into that. It's just routing. We don't care. It's just routing. And then do whatever you want.

**Fred Schott:** [36:30] Yeah, it's our biggest risk and our biggest reward. Almost like this idea that any one of those camps, right, so the React camp or actually, we've picked on them enough, like the Svelte camp, let's say. A Svelte developer says I'm a smart developer. I love Svelte. Svelte's for me, and I want the framework that's best for Svelte. And it's really hard for Astro to say, like, that's Astro when there's like, literally Svelte Kit that the Svelte team built for you, that Rich Harris is blessed is the best way to build a Svelte app. It's our biggest risk, and that we will always be the general kind of commons that supports everyone. But by that definition, isn't optimized for anyone. The reward there is that then, as a commons, you have a much larger audience that we're talking to. So I think our usage is very much a reflection of, like, by not being opinionated, we let you bring your favorite framework, and our goal is to make it feel like it's first class. And I think especially with the big frameworks. We do a really good job of that, but it's still hard as a messaging, like, well, do I want Astro or the thing built for me as Svelte developer? I think part of that is getting people to break out of these camps a little bit, I think. And it's why I love this kind of, like, SPA versus MPA conversations. It almost shifts it as like it's not React versus Svelte. It's like architecture versus architecture. And if you start thinking of Astro as a different architecture I have seen, it kind of breaks you out of that sort of in-group out-group thinking where you can still just use the best tool for the job.

**Chuck Carpenter:** [37:51] Yeah. And at the end of the day, I think that behooves everyone.

**Fred Schott:** [37:55] Yeah. I mean, it's very much an older school way of thinking, but WordPress, Rails, Django, they were never like, oh, we're the React server framework for Python. Everyone, I guess, has to choose their thing. And so for those, it was more the server language was their choice, but it still had this flexibility that I think we've lost over the last decade, which is, and I think everyone kind of encourages their camps. Right? It helps you build a brand. It helps if you're a company that's it owns a project. It helps you build your company brand. Like, there's this kind of sneaky I don't want to say insidious because I don't think it's ill intention, but it's almost like the incentive is to push your community into a camp. Like, come be a Svelte developer, a React developer, a Vue developer. Even the newer, Quick, and Solid everyone has this incentive to build a community around this in-group. But then you're kind of making the problem worse, not better.

**Robbie Wagner:** [38:41] Yeah, I think one of the biggest things that's really nice, too, is just like the focus on HTML as a first-class citizen because there was a tweet from Ryan Florence, like today or yesterday or some time where he was like, oh, in React one, you could only use divs. No wonder no one knows what a form element is. And I was like, yeah, it's almost like React was built as a thing to add some interactivity to HTML occasionally instead of the thing you're supposed to build full apps in. So yeah, I don't know how we get that to shift in people's brains, but everyone's like, how do I learn the most complex JavaScript, whatever the framework that I'm going to be using is when really what you should be learning is HTML and CSS and fundamentals and maybe some vanilla JavaScript and then kind of dive into frameworks. So I think Astro has the correct ordering of the mental model of, like, let's build the app in the fundamentals, and then, oh, I hit this thing that needs to update dynamically. Okay, now I reach for this framework to do the thing.

**Chuck Carpenter:** [39:42] Yeah, you embrace correct document structure, but I mean, at the end of the day, I just blame hiring, really. Right. The demand in hiring is that you know this specific thing and the way that you create job descriptions, and you're like, you understand React, and you're being tested on React, and you can build quickly in React and a pair programming situation or a take-home test or whatever it is. They don't care if you come back with correct HTML document structure.

**Robbie Wagner:** [40:07] They should.

**Chuck Carpenter:** [40:07] Most places don't really care about that. I know they should. Right. And it's a funny thing because a part of that used to be about correct indexing of pages around document structure, but then they created clever ways to sort of work around that, and SEO became a different algorithm. And so some of the importance around that, I think, has been lost. But at the end of the day, that's sort of what matters. So you're not really incentivized to structure your application to have correct document structure. You are incentivized to put out an application that looks like the design you were given. And even those things have started to flex and improve over time. But I mean, I definitely can say, like, ten years ago, you're enforced to have pixel-perfect output of something that you're given even in three different sizes. And so when it's at those three sizes, it really has to have that kind of output, and a normal document structure might not support that. And then you have to put in placeholder divs and artificial bullshit in between, and it's because that's got to move those slices around. That's right. And that's how let's not talk about tablebase layout. It's a nightmare for me.

**Fred Schott:** [41:19] You always use the word should, which I think is a really tricky word here because I think there's always that question of, like, there's a developer who uses semantic markup and spends a lot of time learning and building that and ships their product, and then the company dies. And there's the version of that story where they don't spend the time learning that they get something out that works, and it gives them one more week or one more month of runway. And was one of those developers, like, better or worse, right or wrong, should or shouldn't? I think that's where I get a little lost. And I think there is this idea of aspiring to make it easy to do the right thing, but I think that's where my tooling brain comes in. It's like, well, I think up until this point, up until after at least, it was like, okay, so you're saying I have to not use Next.js, which gives me so much out of the box, right? I have to not use React. I have to go into basically chopped my way through the jungle to find my own way through, just because this is the right thing to do. And I think that's a really hard sell, even if you do believe that's the right thing, like morally, technically, like writing good HTML accessibility, there's things lost when you don't do the right thing, and people are kind of hurt by that. The web becomes less accessible, less available, but it's been really hard to say, well, you sacrifice to do that. And I think that's where Astro comes into the picture, is like, we don't want it to feel like a sacrifice to do the right thing. We want to be really easy. And that's the thing that's demolished over time.

**Chuck Carpenter:** [42:36] Yeah, I think I agree and disagree with you to a component that some of that ideology comes out of startup culture. And I think startup culture has influenced developer culture a lot, even though 85% of jobs on the web probably aren't within that same paradigm. But that paradigm is kind of the loudest one. It's sort of like there's a lot of contribution and influence from startup culture and ideology and like, oh wow, look at these successful engineering teams that are like blowing up and creating all these crazy cool products and open source stuff as an offshoot of that and all these other things. That's how we should also be because that's like some paradigm for success. So I think that there's that aspect of it. So there's just not really a one size fits all.

**Fred Schott:** [43:27] One thing about what you just said is like almost the craft is lost there. All you care about is the hustle. You've lost the craft of what we do. And I totally agree with that.

**Chuck Carpenter:** [43:34] That's a great way to say it. I think that's what I'm really trying to get at is that there's no one size fits all in that, neither in your tools or in your way of working necessarily. And if you are in an environment it where you have to ship constantly, and you potentially make sacrifices, and people within your organization understand and accept that, then great, then that is what you have to do to succeed. And I can understand that, like, right, you can't have productivity loss to do it right all the time, and maybe you're building up a lot of tech debt, and there's some sacrifice there. But then again, maybe accessibility isn't important in your vertical for you, for whatever reason, for the product that you're shipping. Maybe it's just like we see it, we absorb it and accept it, and then we'll have to address it at another time. That's great. That's a very conscious decision, and I just don't think it's always that conscious.

**Robbie Wagner:** [44:22] So, super important question. What's your favorite HTML element?

**Fred Schott:** [44:29] I mean, it's such a sucker's answer, but the marquee. Bring back the marquee.

**Robbie Wagner:** [44:34] Nice. Not blink.

**Chuck Carpenter:** [44:35] I was going to say I thought you were going to say blink.

**Robbie Wagner:** [44:37] Yeah.

**Fred Schott:** [44:38] Oh, nice. Okay. I didn't think that I was going the kind of alt route, but no, we actually recreated the marquee on one of our early websites. It had to kind of scroll. And we did our best to stay true to how it originally behaved, which I was very proud of.

**Chuck Carpenter:** [44:49] I like that. Nice.

**Fred Schott:** [44:50] And then, of course, on, I think I want to say Safari, it ended up grinding the entire page to a halt by some weird WebGL, whatever issues the platform's got some kinks to figure out. But, yeah, we still were able to ship it, which is fun.

**Robbie Wagner:** [45:04] Nice.

**Chuck Carpenter:** [45:05] So that sounds like an open-source project right there. Just ship that. I'm going to add it to our site, see what happens.

**Fred Schott:** [45:11] NPM install marquee.

**Chuck Carpenter:** [45:13] Yeah. Okay. Done. It's funny because I learned HTML from my little brother, who was making, like, geo city sites for some video game that he was on. He played this game called Like Tribes, which was like, you get together in tribes and shoot other robots.

**Fred Schott:** [45:27] Nice.

**Chuck Carpenter:** [45:28] Yeah. Fun fact. There's a late bloomer there. Yeah.

**Fred Schott:** [45:32] I don't know if anyone ever played Second Life. That was how I actually originally learned how to code, was I built things for Second Life, which was a very odd VR world that I feel like meta and everyone needs to take way more lessons from because it was, like, kind of a failure in a lot of ways and also found it's kind of like biggest life after they stopped. When the hype died down. I think it still exists today as much more of a kind of niche thing, but there was a whole scripting language they built, which is wild for moving things around VR. Sorry. 3D. It wasn't VR at the time. Just a 3D space through gaming is a huge kind of mind trick. All of a sudden, you spent a year coding, not actually playing around, and you kind of don't even realize it.

**Chuck Carpenter:** [46:12] Yeah. You're incentivized by the extension of the gaming aspect. I still want to be in it. What can I do? Yeah, I remember messing around in Second Life for a minute, and I was like, wow, this is weird. It's almost what it was like for me playing Sim City, though, where it was like you had to show up and do life in a game after you're done with life for the day. I don't know.

**Robbie Wagner:** [46:35] Yeah, you just do a different life. Theoretically. You don't pick the same job you had already.

**Chuck Carpenter:** [46:39] It's a better life.

**Fred Schott:** [46:41] But in this world, you can fly, your house is in the clouds, and you

**Chuck Carpenter:** [46:44] That's true.

**Fred Schott:** [46:45] No, there's a weird element of zoning regulation for a game that was about following your imagination. It's like you can buy land, and it's a very capitalist 3D world. It's very odd.

**Chuck Carpenter:** [46:54] Yeah. I can remember The Gap set up shop there or something weird.

**Fred Schott:** [46:58] Okay, so this needs to catch on. I feel like I need to talk about this more because one of my favorite things watching Meta build there, like, Metaverse. Second Life, it was before memes, I think, were really a thing. So this is a premium meme, Ben and Jerry's announced Ben and Jerry's Island spent, I think, $2 million for whatever the rights were and whatever they built an island in Second Life, and it was a news article. Ben and Jerry's enters VR. 3D world. Like, is this the new trend? And you would go to it, and it was empty. You'd walk around an island empty, but like, weird Ben and Jerry's artwork. And I put on one of those VR headsets the other day, and it was totally empty. I'm like, oh, this is Ben and Jerry's island. That's what we should be calling empty VR world. Ben and Jerry's island.

**Chuck Carpenter:** [47:39] Oh, my gosh, that's so funny. I have to check that out. Yeah, I do a little bit of the VR thing, but I mostly play, like, miniature golf and disc golf and stuff with my brother.

**Fred Schott:** [47:48] Nice.

**Chuck Carpenter:** [47:49] Yeah, that's fun until you run into a wall with your face, but that's a whole other story, so yeah, I know. We're getting it. We need to talk about some whatnot-y like things. So it's an interesting thing you mentioned earlier. Me and my research and whatever else. As far as I can find or am concerned, you have no hobbies outside of Astro. You, I guess, four years or so ago, really wanted to adopt a dog. So I don't know if that happened.

**Fred Schott:** [48:14] No, never did. I had a kid instead.

**Chuck Carpenter:** [48:16] Okay. Yeah, those are better than dogs. Anyway.

**Robbie Wagner:** [48:19] Do you pet your kid?

**Chuck Carpenter:** [48:23] In my mind, your hobbies and our career have been about making developers' lives better or improving developer tools. Right. So you did the whole Snowpack thing. You were on the Polymer team. I remember Polymer back in the day and was, like, so excited of this ideology of web components again, these, like, very compartmentalized bits of the web that were so smart about everything about themselves. And then Polymer was the thing that was making them real right now. And eventually, they're going to become a real thing. They're still not a real thing, in case anybody doesn't know.

**Fred Schott:** [48:58] Oh, no, don't bring me into this. No, they're a thing check the data. Yeah, I'm going to push off the debate.

**Chuck Carpenter:** [49:06] Okay.

**Fred Schott:** [49:06] I feel like every six months, we get a new Twitter debate about are our web components real.

**Chuck Carpenter:** [49:10] Fair enough. Okay.

**Fred Schott:** [49:11] What Polymer wanted them to be was a web framework, which they are not. You shouldn't be trying to recreate Next.js and Polymer, but as far as adoption, they're pretty well adopted.

**Chuck Carpenter:** [49:20] Okay, fair enough. Fair enough. We'll table that one.

**Fred Schott:** [49:22] Sorry. You can tell that there's some scarring there.

**Chuck Carpenter:** [49:26] Yeah, no, I can understand that. I can understand that. So aside from those things, hobbies, what does Fred like to do? Or Pred, as I call him. That's my pet name for you.

**Fred Schott:** [49:37] Yeah. Having a kid becomes pretty all-consuming, so that took a lot of that space, as I'm sure. Yeah. I know you mentioned you had kids. So before pre-kid coding kind of was my hobby. I really was one of those people who I had a job. I was very lucky to work in tech. And then I'd go home, and I'd work on a side project, or I'd play around with something new and so weirdly without me realizing it more from a hobby to a job, and a pretty all-encompassing one. It's one where I can kind of have a lot of creativity. So over the last week, we built, pretty much within seven days, a full AI support bot for Astro, which was really fun. I never worked with before. I have no idea how ChatGPT works. Have a little bit better idea now, but still, like, 2%. But that idea of understanding, playing around with new tech is something I'm very fortunate to get to do in my job. So that kind of, in some ways, scratches both ticks both boxes.

**Chuck Carpenter:** [50:29] Nice. Okay, fair enough. Robbie is very much like that too. Goes home, codes more stuff, does a lot of open-source. Or did he also had a kid this year, so?

**Robbie Wagner:** [50:41] It's a lot less now.

**Chuck Carpenter:** [50:42] It's a lot less.

**Fred Schott:** [50:43] Yeah. So I think I was on a panel with Zach Leatherman, who built Eleventy, and someone asked him that, so, Zac, what are your hobbies? And he very much, like, laughed, like, very outwardly laughs. He was like. I have a kid. Like, what do you mean hobbies? And I remember I looked at him. I was like, you can say that. You can say that in public. I always felt so much shame or guilt over, like, I don't have any good hobbies. I'm not a guy with hobbies.

**Robbie Wagner:** [51:06] An hour or two of free time a day is not enough for hobbies.

**Chuck Carpenter:** [51:09] Yeah, exactly. Because even if you have kid-free time, then you need to spend some time in your relationship or whatever. I mean, basically, my rinse-repeat days. Like, I'll go home at the end of the day, spend time with the kids, we do dinner, get them ready, they go to bed, read them books, all of that. Wife and I sit on the couch for an hour, try and watch something new together and spend a little time together, and then we're exhausted, and we go to sleep, we wake up and do it all over.

**Fred Schott:** [51:35] Yeah.

**Chuck Carpenter:** [51:35] And that's just the reality.

**Fred Schott:** [51:36] I will say I have a friend who is a pediatric surgeon who works crazy hours and has, in the time, like the last three months, has built a chicken coop in his backyard. So I don't know what to make of that. It's like, what did I contribute? It's like, well, I sat in a meeting all day, and he's like, I saved lives of these hands. Like, okay, fair enough, fair enough.

**Chuck Carpenter:** [51:56] Okay, whatever. We're not comparing comparing societal contributions. I mean, whatever.

**Fred Schott:** [52:01] Yeah. I mean, if we were. Yeah. Clearly that's a much more important thing to save children's lives. But no, we don't actually count.

**Chuck Carpenter:** [52:08] Yeah, we don't need to do that. That's fine.

**Robbie Wagner:** [52:10] Yeah. People wouldn't even be able to find his services without the Internet.

**Fred Schott:** [52:14] Exactly.

**Chuck Carpenter:** [52:15] Yeah. There's no Yellow Pages anymore. Right. I don't get a Yellow Pages anymore. So I think that's it. I can't just look up surgeon. Pediatric surgeon. Best one. No idea. Ask friends. No, I go to ChatGPT and ask that now. Exactly. It's the new Google. That's what everybody says. And now I'm going to ask. Well, first, I got to tell you why I say Pred. I've had many lives, and like a cat, even though I don't have cats. And I used to be a bartender forever back in the day. And one of the other bartenders was Filipino, or he is. I don't know if he's dead. And he also never changed nationalities, as far as I know. And his name was Garapredo, and Fred for short. Or, as he would say, Pred, because they don't have F's. Filipino doesn't have pilipino. That's what they say in Tagalog.

**Fred Schott:** [53:06] Interesting.

**Chuck Carpenter:** [53:06] I think it is, yes.

**Fred Schott:** [53:08] There you go. There's not a lot of good Freds out there. I feel like. There's Fred Armison.

**Chuck Carpenter:** [53:12] Flintstone.

**Fred Schott:** [53:13] Freddie Kruger. Bad Fred.

**Chuck Carpenter:** [53:15] Yeah, Flintstone.

**Fred Schott:** [53:15] Fred Flintstone. Good Fred.

**Chuck Carpenter:** [53:17] Good Fred.

**Fred Schott:** [53:18] There's not that many.

**Chuck Carpenter:** [53:19] Yeah.

**Fred Schott:** [53:20] Every other king of Sweden is named Fred. They have a weird system where you have to take one of those names. Then they flip-flop them. So I guess I don't know what your thoughts on Swedish politics are, but I would call generally good.

**Chuck Carpenter:** [53:32] Yeah. I think in general, good. Is it Frederick, then?

**Fred Schott:** [53:35] Yes.

**Chuck Carpenter:** [53:35] And your child, boy or girl?

**Fred Schott:** [53:38] Girl. Name's Wren.

**Chuck Carpenter:** [53:39] Okay. Yeah. So you really can't.

**Fred Schott:** [53:41] Like the bird. Yeah. Nice to say. Your options to kind of keep the name going. Tough.

**Fred Schott:** [53:48] Well, my dad was a Charles. A Charles III, so it was actually very controversial. And I was not named Charles.

**Chuck Carpenter:** [53:53] Wait, I am Charles III. I don't know if you heard that.

**Fred Schott:** [53:56] Oh, my God. Wait.

**Chuck Carpenter:** [53:58] I'm Charles William Carpenter, the third. It was kind of controversial that I didn't name my son that. He's Aiden Ferguson.

**Fred Schott:** [54:04] There you go.

**Chuck Carpenter:** [54:05] Yes. But my daughter is Charlotte, so that's how we connection made it work.

**Fred Schott:** [54:10] Nice. There's something to the parents. Yeah. Okay, I'll connect you and my dad. Sure, you'll have a ton to talk about.

**Chuck Carpenter:** [54:15] Yeah, exactly. Enjoy this. The girl.

**Fred Schott:** [54:18] Yeah.

**Chuck Carpenter:** [54:19] That's funny. Charles III. Small world.

**Fred Schott:** [54:22] It could have been the fourth.

**Chuck Carpenter:** [54:23] There could have been. But oh, well, there's not now because shops closed. If anybody didn't know out in the Internet world, shops closed. I'm just going to let that resonate for a second. My only other question was around. I keep asking this thing because I feel like Astro is great marketing for really cool swag. And part of it is because Nate has a NASA jacket, and I'm super jealous. I didn't know that I would have applied if I know that, as an employee, you got NASA jackets.

**Fred Schott:** [54:53] You reminded me three months ago. He told me, Fred, I did the podcast with the NASA jacket. You got to do it yourself. Three months came and went. Completely forgot.

**Chuck Carpenter:** [55:03] That's it.

**Fred Schott:** [55:04] No NASA jacket. I mentioned that we are staying with friends right now. Total tangent. I'm in California. Lots of rain. A tree tipped over fell in our house during the rainstorm. So we are now staying at a friend's house. This beautifully manicured background. Not mine.

**Chuck Carpenter:** [55:18] Oh, okay. So see, your house way shittier.

**Fred Schott:** [55:20] Even if I wanted to wear a NASA jacket right now, I couldn't. It's somewhere under a bunch of plaster that fell from the ceiling.

**Chuck Carpenter:** [55:26] The CEO of HTML doesn't pay that much, so his background was, like, real bad. So he has to go to a friend's house for a better background on podcasts that aren't really video anyway. Well, next time.

**Fred Schott:** [55:38] Exactly. But yeah, no, I actually remember that. Yeah, it's been a while since we've done swipe. We do secretly have a swipe shop that is cooking. Maybe by the time this is out is already there, but we're kind of, like, soft launching and not making a big deal about it. Our goal is to have really fun swag on it. Not just the T-shirts but, like, flamethrowers like Elon Musk. Like our version of that without the Elon Musk. That's probably not a flamethrower, but like neon sign, keyboard, little things.

**Chuck Carpenter:** [56:04] Keeping all these in.

**Robbie Wagner:** [56:05] Yeah, neon sign, I would take.

**Chuck Carpenter:** [56:06] Yeah, that'd be pretty dope.

**Fred Schott:** [56:09] All right, I'll keep that in mind.

**Chuck Carpenter:** [56:10] Yeah.

**Robbie Wagner:** [56:10] I don't know if you can see behind me. I have a nice slop sink, so I need to get a better background so that I can have some stuff behind me.

**Fred Schott:** [56:18] Oh, it's a podcast, right? I mean, who's going to know?

**Robbie Wagner:** [56:21] Yeah, well, I mean, unfortunately, the people that edit the podcast pick my video over Chuck's a lot of times for the snippet. So you get a lot of slop sink in the Twitter feed.

**Chuck Carpenter:** [56:32] Slop sink makes it sound like you have pet pigs or something.

**Robbie Wagner:** [56:37] I guess utility sink. That sounds a little nicer.

**Fred Schott:** [56:40] I see a lot of spray bottles.

**Chuck Carpenter:** [56:41] Yeah. When you go buy them at Lowe's, they call them utility sinks.

**Fred Schott:** [56:45] Okay.

**Chuck Carpenter:** [56:46] Yeah. Fun fact, I spent too much time at Lowe's. Sorry.

**Robbie Wagner:** [56:50] All right, we're at time here. Was there anything we missed? Anything you want to plug Fred before we end?

**Fred Schott:** [56:54] No. I'm glad I could finally come on and drink some great whiskey. Astro is really fun. I would implore anyone to check it out, especially if you're building a content-focused website and are kind of fed up with the JavaScript apps of the world. This is a kind of fun relief from that. Astro.Build is the website. Astro.Build/Chat is our discord, which is really, really fun. I would definitely recommend checking that out. This is going to be very confusing, but we're twitter.com/Astrodotbuild now. In this one, the dot is spelled out so Astro dot check the show notes. I'm sure they'll do a good job and put that there. But anyway, there will be Astro build is everywhere, and yeah, please come by and check it out.

**Robbie Wagner:** [57:30] Cool. Thanks, everybody, for listening. If you liked it, please subscribe. Leave us some five-star ratings, and we will see you next time.

**Chuck Carpenter:** [57:38] Boom, boom, boom. Thanks for listening to Whiskey Web and Whatnot. This podcast is brought to you by Ship Shape and produced by Podcast Royale. If you like this episode, consider sharing it with a friend or two and leave us a rating, maybe a review, as long as it's good.

**Robbie Wagner:** [57:58] You can subscribe to future episodes on Apple, Spotify, or wherever you get your podcasts. For more info about shipshape and this show, check out our website at shipshape.io.
