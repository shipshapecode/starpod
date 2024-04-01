**Robbie Wagner:** [00:09] What's going on, everybody? Welcome to another Whiskey Web and Whatnot with myself, RobbieTheWagner, and my co-host, as always, Charles William Carpenter III.

**Chuck Carpenter:** [00:19] Third, third, third.

**Robbie Wagner:** [00:22] With our guest.

**Chuck Carpenter:** [00:23] That's my big.

**Robbie Wagner:** [00:24] You always say something after. Anyway, with our guest today, Ryan Carniato. How's it going, Ryan?

**Ryan Carniato:** [00:32] It's going pretty good. Just having a nice Tuesday afternoon. It's actually a crazy windstorm here in San Jose, where I live. It's very uncommon for us to have rain or anything, but it's like I've never seen anything like this in the last I've only been here like three years, but still.

**Chuck Carpenter:** [00:47] It's unprecedented times in California weather this year, for sure. I don't know what's going on in the world.

**Robbie Wagner:** [00:52] Yeah, I'll take some of that snow.

**Chuck Carpenter:** [00:53] I heard it's getting warmer and colder some places.

**Robbie Wagner:** [00:57] Cool. So for folks that have not heard of you or SolidJS or the things you are involved with, do you want to give a quick intro into who you are and what you do?

**Ryan Carniato:** [01:09] Yeah, I work on open source, is the best way to put it. I created the framework or JavaScript library slash framework SolidJS. It's something that I've been working on for quite some time. Started sometime around in 2016 and then open-sourced in 2018, and released 1.0 in 2021. But beyond that, it's funny doing that, teaching about it, writing articles led me to actually working at eBay for a while, working on their open source framework, which introduced me to a lot of other people working on open source frameworks. So next thing I know, I'm writing articles about other open-source frameworks as well and just digging into the whole space. So now I work at Netlify, and basically, that's like my mandate. I just get to work on open-source JavaScript frameworks. Doesn't matter if it's Solid or other ones, but I do spend most of my time working on Solid.

**Chuck Carpenter:** [02:03] Nice. Cool. I find that to be a very interesting position to be in. And so, we will put a pin in that one because I definitely want to come back to it as like open source as your job, and Netlify happens to pay you.

**Ryan Carniato:** [02:15] Yeah, that's the thing.

**Robbie Wagner:** [02:17] Cool. So, Chuck, you want to tell us about the whiskey?

**Chuck Carpenter:** [02:21] Sure. So this is Barrell whiskey out of Louisville, Kentucky. This is their Infinity Barrell Project. It's quite a warm one at 127.22 proof. And so 63.61% alcohol. Fairly significant. It has whiskeys from Poland, Ireland, Scotland, Tennessee, Kentucky, and Indiana. And I'm not sure if you're familiar with the concept of an infinity bottle. Like, the whiskey nerds have this thing. Some people even do a barrel. But you have this bottle here that say you're getting to the end of one of your bottles. You just pour the rest of that in your Infinity and constantly just mixing up your leftovers and trying it. And people have various rules like, oh, only put bourbon in there. Some people will put anything called whiskey in there, and you end up with very interesting stuff over time. So you always have a little bit of what's been there before, and you're adding something new. And that's essentially what they do with these releases. So they'll bottle up a bunch of it and leave some in the barrels and then put new stuff in there. And then it's just like the next release has a little bit of that and then some new things that we put in. I think it's pretty clever to actually commercialize that whole practice.

**Ryan Carniato:** [03:33] Interesting. Okay.

**Chuck Carpenter:** [03:35] So we'll see what we think of it. We have tended to like this company's stuff, though I've so far not had a thing that I didn't think was, like, tasty and interesting. Some better than others, of course, but.

**Robbie Wagner:** [03:47] There's always a first time.

**Chuck Carpenter:** [03:48] Yeah. This one sucks. Sorry, Ryan. We tested it out on you.

**Ryan Carniato:** [03:54] It's all good. I'm curious. I'm not much, necessarily, of a whiskey drinker straight, or at least not in recent years. It's a little bit different back when I was playing in punk bands, but I was not sipping on whiskey.

**Chuck Carpenter:** [04:10] Right. Yeah.

**Robbie Wagner:** [04:11] Right.

**Chuck Carpenter:** [04:11] The quality might be a little different too. Getting a little orange rind and.

**Robbie Wagner:** [04:18] I smell some kiwi somehow.

**Chuck Carpenter:** [04:20] Kiwi?

**Robbie Wagner:** [04:21] I don't know if that's just me.

**Chuck Carpenter:** [04:22] Did you eat some kiwi? You had a ginger ale before?

**Robbie Wagner:** [04:24] I had a ginger ale. Maybe that's mixing with the smell.

**Chuck Carpenter:** [04:27] Yeah. I don't know. We make up words and pretend like we know what we're doing here. Yeah, I get a quantro. Kind of like if you had a cocktail that had pretty hot whiskey in it and hot. I just mean, like high proof. So it has some burn, right? And a little bit of quantro in there or something. You're still getting like that orange rind, orange essence to it.

**Ryan Carniato:** [04:50] Yeah, I guess that's it. Lime. And you said citrus of some sort.

**Chuck Carpenter:** [04:56] Yeah. So I get that. A little leathery kind of in the finish.

**Ryan Carniato:** [05:02] It's a little bit viscous.

**Chuck Carpenter:** [05:04] What does that mean?

**Robbie Wagner:** [05:07] Like thick?

**Ryan Carniato:** [05:08] Yeah, doesn't it?

**Chuck Carpenter:** [05:10] Viscosity? Like an oil.

**Ryan Carniato:** [05:11] Am I using that wrong?

**Chuck Carpenter:** [05:12] I don't know. I've heard people use that in relation to wines before. And then viscosity with, like, oils because I used to work on cars.

**Ryan Carniato:** [05:19] But yeah, it's thick.

**Chuck Carpenter:** [05:20] Viscous. Okay. It does coat the tongue.

**Ryan Carniato:** [05:23] So this whole podcast started so you guys could get, like, the deep whiskey voice and hear yourselves on recording it back.

**Chuck Carpenter:** [05:30] No, I mean close. So we could get these microphones that give us that cool voice.

**Robbie Wagner:** [05:35] Yup.

**Chuck Carpenter:** [05:35] And then it's also free whiskey arbitrage. Right. Because it's a business expense.

**Robbie Wagner:** [05:41] Business expense.

**Chuck Carpenter:** [05:41] Yes. But you've got it. Yeah. It's all bullshit just for those things.

**Robbie Wagner:** [05:47] Yeah.

**Ryan Carniato:** [05:47] I mean, that was the best thing because saying punk rock, saying hardcore, at a certain point, this was the only you're supposed to take care of your voice when you're a singer. But at a certain point, a couple of days into the studio, you're just giving it full volume, five, 6 hours straight. I mean, this is the best throat cure there is, right?

**Chuck Carpenter:** [06:11] Exactly. Plus, you're like trying to live the rock star life, right? Otherwise, what's the point? You can't chug a bottle of Jack Daniels. I mean, I watched was it some of those Motley Crue documentaries. I know what was up. So in terms of this, we do kind of an arbitrary scale, so it's one to eight tentacles because we are very clever, as you might see behind me. There's an octobeast there. And so one being like worst thing you've ever had. Eight being like, amazing, never want to drink anything else again. All variations in between. Robbie and I, since we've been doing this a whole bunch of times, we tend to start to segregate things. So I would put this in, like, an American whiskey category versus bourbon or rye or obviously like scotch and that kind of stuff. So to show you how it goes, I guess I'll go first. I think for as high a proof it is. It actually is smoother than I expected. I expected to have a heartburn, to be honest, so I appreciate that. And I like the citrus forward. It lacks some diversity after that, so I'm probably thinking in the Barrell things I'v ehad some really tasty stuff from them, so it might be more of a five. For me, it's better than average, so I would say I'd recommend it, but I'd probably choose other things.

**Robbie Wagner:** [07:25] Yeah. Am I next?

**Ryan Carniato:** [07:27] Sure.

**Robbie Wagner:** [07:28] I don't know what order we're going in.

**Chuck Carpenter:** [07:29] Unless Ryan's ready for it, I don't care.

**Ryan Carniato:** [07:31] Yeah, go for it.

**Robbie Wagner:** [07:33] All right. I'm thinking kind of the same as you, so I would, on its own, give this a six, I think, but compared with other Barrells being so amazing, I would say this is a little bit lacking. Maybe it's different every time because of the infinite barrel kind of thing, but yeah, I'd say five.

**Ryan Carniato:** [07:50] Yeah. I don't drink much whiskey straight, at least, or when I did, it was really cheap stuff, so this is much better from my perspective. So I probably don't have the nuanced taste as well. So for me, I'm pretty happy with this. It's not the best whiskey I've ever had, but I'm going to give it a six.

**Chuck Carpenter:** [08:10] Nice. Cool. That's pretty solid. What would you say is the best whiskey you've ever had?

**Ryan Carniato:** [08:13] That's a good question.

**Chuck Carpenter:** [08:17] You can sit on it if you want to think about it. I did put you on the spot, and you're not sure, and you don't drink a lot of whiskey, so you're trying to like.

**Ryan Carniato:** [08:23] Yeah, so it's like it's been years, so I don't even know if I get the name right. I'm not sure.

**Chuck Carpenter:** [08:28] It's not Canadian, is it?

**Ryan Carniato:** [08:29] Might have been Canadian. I mentioned to you guys that rye whiskey in Canada is not the same as American rye. Whiskey, right?

**Chuck Carpenter:** [08:37] Which is totally fine because I'd like some Canadian ryes, and there's nothing wrong. I think Canadian whiskey can be very good. Obviously, Crown Royal does some weird stuff with it, as do many other producers. Right. I don't want apple flavoring in my whiskey. Just like, no thank you, but no dig against those.

**Ryan Carniato:** [08:53] Generally speaking, yeah. I like when it's smooth. When you're talking about how much alcohol was in it, I was like, oh, is it going to be like that? Because when I first came to the US. A few years ago, we were like, oh, I got a few different types of whiskey, actually. And I was like, just go along with my other alcohol when we first came in and kind of, like, stocked up. Can't bring that stuff across the border. At least not shipping it the way it was during COVID, anyways. I was like, oh, we should just do some tasting. I don't know anything about tasting. We should just do some tasting. And it was not the best. I also did not get the good stuff at all.

**Chuck Carpenter:** [09:29] You were like, I haven't seen this. Let's get it.

**Ryan Carniato:** [09:33] As I said.

**Chuck Carpenter:** [09:34] Yeah. Nice. Well, if you think of the one that you liked the best, then would be totally curious, but not a big deal. Don't need to force you to think about it for the next five minutes while we lull and stare at your face. We can talk about other things.

**Ryan Carniato:** [09:48] This is good. This is good. Like the fact that I can just keep on drinking it. It's good.

**Chuck Carpenter:** [09:52] Yeah. And pro tip, actually. So you can change it in a couple of different ways, too. Especially one that has high alcohol like this. So it just means that's how they took it out of the barrel, went straight. They didn't proof it down any or anything like that. So you can change whiskeys oftentimes by just adding like a few drops of water, and that oxidizes it a little bit, opens it up, basically provides some air in there, and that will give it a slightly different flavor. And then you can even go much further and put like a large cube or something in there. And then that will cool it down.

**Ryan Carniato:** [10:22] As it turns out, I have a cup of ice cubes aside. I wasn't sure if it was like, customary or good. I'm going to try this.

**Chuck Carpenter:** [10:29] Yeah, do it. I invite you to do it because I think it'll change it some for you too. So I very much go by the creed of, like, the best whiskey is the one you like and that it also includes the way you like to drink it. Except for Robbie, because he puts crushed ice in there, and it melts really fast. And I don't get it, but everything else is on the table.

**Robbie Wagner:** [10:48] You have to drink it really fast.

**Chuck Carpenter:** [10:50] There you go. That'll make for a good podcast. So on to maybe more professionally, like things. We have some hot takes because I just watch people get ridiculous on Twitter sometimes, and so you're a part of it sometimes. So that's why I was like, I can't wait to talk to him. So, yeah. Robbie, you'd want to dive in the hot takes?

**Robbie Wagner:** [11:11] Sure.

**Chuck Carpenter:** [11:12] As you take a drink.

**Robbie Wagner:** [11:13] Yeah. Let's go with the classic here. Git rebase or Git merge?

**Ryan Carniato:** [11:17] It's funny, I've always been a Git merge person, but I've been doing more rebasing as of recently. But yeah, I'm more in the Git merge side.

**Chuck Carpenter:** [11:26] Interesting. Yeah.

**Robbie Wagner:** [11:28] I feel like that's rare to find someone on the other side, but everyone likes it different, so that's fine. How do you feel about Tailwind? Do you use Tailwind or vanilla CSS?

**Ryan Carniato:** [11:37] I have not used Tailwind. I don't have a problem with it. I think people like for me. It's not a drama point. I get the appeal of it. I'm not a CSS purist, but I kind of like CSS and JS because then I can actually do CSS. I'm not very good at CSS. On the other hand, I would never recommend CSS and JS because of performance.

**Chuck Carpenter:** [11:59] Right. Yeah.

**Robbie Wagner:** [11:59] That's fair.

**Chuck Carpenter:** [12:00] So there's two sides of that coin. Yeah. I'm kind of, like, in the camp of I don't care enough about it to have a fight, so whatever you want.

**Ryan Carniato:** [12:06] Makes sense.

**Robbie Wagner:** [12:07] Yeah. This Typescript one's kind of old, I guess, but inferred types or explicit types? In Typescript.

**Ryan Carniato:** [12:15] It's funny. As a library author, actually, explicit inferred is better when you're doing, like, application-type stuff, like, when you're actually building the app. But Typescript is not perfect. It's not even close to perfect. So when I'm building stuff at the lowest level that everyone else builds upon, I want to have the most control over that. So I will lie to the type system if it will give everyone better experience.

**Chuck Carpenter:** [12:38] Nice. That's fair. Yeah, I think that's very fair, and I appreciate that responsibility. At the root level, there.

**Robbie Wagner:** [12:45] Yeah.

**Ryan Carniato:** [12:46] Typescript is the tool. At the end of the day, it's really difficult because there's, like, a desire, and I get it to be like. This is the truth. But Typescript can't be the complete truth in the world of JavaScript. There's just too many exception cases. Typescript is it's funny because when you think of Types, you think of something like concrete, like something that you can build on and that are dependable. But in JavaScript, it's more like an art. It's kind of like painting. It's kind of like, oh, I will kind of like you can have discussions with people about how you could exist the right way or this way. You almost get, like, a second dimension of characterization there. Honestly, I could picture someone talking about high school. It's kind of like an art critic talking about a work of art. And the original artist could be like, no, this wasn't what I was trying to get across. It's that interpretive from my perspective. I know not everyone feels that way, but it's like we invented a programming language on a programming language, and that's why we get so many hot takes and discussions around this because it is very arbitrary.

**Chuck Carpenter:** [13:51] Yeah. Highly subjective, I think. And that's probably one of the biggest problems in the JavaScript technical interview, in my view, is that there's a lot of different ways to skin a cat. And if you get into someone who has very terrorist opinions about how things should get done through this test, then unless you encounter someone who has the same feelings, they're going to fail just because the subjectivity of that right. Like, did it work, or didn't it did work? So I passed. But you don't like the solution. That sounds like your problem. Right.

**Ryan Carniato:** [14:25] It's interesting because I have experience in other type languages. I've been developing software in some shape or form for, god, like, 25 years, maybe even longer, actually. Truthfully, I've been on the web for like 25 years, but yeah, even longer than that. And I've used plenty of type languages. Typescript is not like those. If you come in with like a type language expectation, it's different too. I remember that whole return types discussion on Twitter between Prime and Theo was based on the fact that Primagen was basing his thinking on sound-type systems, like actual type languages. And he's like, this is what you would do. And he's 100% right. But then Typescript is not that right. In a sense, Theo is actually correct, but it's because of the reality of Typescript, not because of the ideal of what type languages should be.

**Chuck Carpenter:** [15:14] Yeah, okay.

**Robbie Wagner:** [15:14] That's a very diplomatic way to look at it there.

**Chuck Carpenter:** [15:17] Yeah, I hadn't really considered that. That's funny. That's a good take there. Also, now I'm really curious. So, 25 years on the web. So did you start at ten, or are you just much older than I thought?

**Ryan Carniato:** [15:28] Yeah, I'm much older than anyone realizes. I mean, I put on here I had my 40th birthday this year, just last month.

**Chuck Carpenter:** [15:35] Okay, so I'll be 46 this year. But I was also, like, late to the game. I had to screw around in my early 20s for a while.

**Ryan Carniato:** [15:42] Yeah, no, I programmed since I was eleven years old, in some shape or form, thanks to my dad, who went to back to college. He's like an iron worker by trade. You'd never think this guy would be necessarily into computers. And he didn't stay long. He left. He was computers for like two or three years, and then he went to real estate and other stuff. But it was enough of a push for me because I actually haven't told the story too much. But he came home one day, and he was very proud of something he made in QuickBASIC. And it was like this little arrow. QuickBASIC has like that blue screen or something. Like, it was this arrow that went up the screen, and you could see the frame buffer flicker. Like, literally, it was the arrow going up the screen. And I could see the whole screen flickering as it went up the screen. And he's like, Look, Brian, it's a spaceship. And I was like. It's an arrow. But I was, like, ten years old. But I remember looking at that, and I realized instantly that he hadn't just recorded a video or put it in paint, you understand? Obviously, it's kind of obvious to anyone who's a programmer, but there's a difference between realizing this is something that's just manufactured versus he told the computer to do this. And once I realized that I could tell the computer to do this, I was hooked. Within a couple of months, I was making better spaceship demos than him. I was trying to make Asteroids clones, but my uncle was an engineer, and I borrowed his textbooks from university, and I was like, I'm going to learn how to make video games. That's really what got me into it. But it's just that. It's funny because it was, like, only a couple of years of his life, he ended up going on to other things. It was never really his thing. He's a bit older now, and he calls me up, and he's like, why can't I open this PDF file?

**Chuck Carpenter:** [17:20] Right? Absolutely. I love how having any job on the Internet automatically makes you tech support for everyone in your family.

**Ryan Carniato:** [17:29] And that's really how it started for me, right from when I was a kid, even before I got into computers, it was like the guy who fixed the local Sega Genesis or Nintendo machines. It's so funny because that era, it was still very much like, no, go play outside, right? That was the thing. There wasn't Internet. These video game machines are going to rot your mind, so to speak. So sometimes parents would get smart and be like, Ha. I've disabled the device. And I'd be like, how hard is it to plug it into an auxiliary input and figure out how to change the input on the TV and stuff? But surprisingly, that thwarted a lot of my friends. So that's kind of like how I got started. Next thing I know, I was fixing people's computers, doing antiviruses and Geek Squad-type stuff. I've been doing tech stuff. Well, it was kind of a split. It was tech stuff and music I couldn't choose, right? For all my teens, basically.

**Chuck Carpenter:** [18:22] Yeah. It seems kind of like a common path, though, too, because of the practice element and that kind of thing. Definitely. A lot of people I don't know how to play any instruments, but Robbie can speak to that.

**Robbie Wagner:** [18:33] Yeah, I mean, I can't speak a lot to it these days. I played guitar and bass and did, like, piano lessons for years and a bunch of different instruments. But yeah, I haven't really played in a long time now.

**Ryan Carniato:** [18:45] It started with the piano lessons for you, right?

**Robbie Wagner:** [18:47] Yeah.

**Ryan Carniato:** [18:48] There was some instrument when you were a kid. Yeah, exactly. I had this silly music box when I was really, really young. But for me, I played saxophone in school band, and that was like the one where I really took it on my own. I remember I figured out some silly thing like what was it? It was a themed Jurassic Park.

**Chuck Carpenter:** [19:04] Nice.

**Ryan Carniato:** [19:04] Again, I'm aging myself in terms of that. But I figured out how to play Jurassic Park by ear when I joined the band. And from that point, it was just like, I can do anything with this. I think at a young age, when you find those things where you feel like you are empowered to just do whatever you feel like, it's super powerful. So almost everything has been defined by that. I just couldn't choose. It's funny, when you get about 18 or 19, you have to actually make decisions. And that actually made things challenging for me because I both went to university and tried to play in a rock band and go on tour. One had to give, so to speak. Yeah, but that's maybe another story.

**Chuck Carpenter:** [19:40] Yeah. And we might get there. I feel like we might get there, but I'll, again, kind of defer that to stay along the lines of at least our generalized subject matter and the fact that we fast forward to today, and you have Robbie's dream job, which is to do open source software at your own direction and have a paycheck.

**Ryan Carniato:** [20:00] Yeah, it's amazing. It's funny because, as I said, it started for me working, solving actual problem, like working. I was working in a startup, and it was a Knockout JS. Much love for Knockout JS. But the thing was, the startup, we kind of built our own tool chain. As it turned out. I ended up getting employed by the guy who created a library called Knockback. And Knockback was a Backbone Knockout hybrid. Basically. People don't realize this Knockout was the first just a view library. It was actually just a state management library. But essentially, it didn't really care about your models or your back end. And it was a very light library. So he was like, oh, we need to make a framework out of this. Something more like Angular or Ember. So he took Backbone models and glued them. But it meant, like five years later or whatever, when he's no longer working at the company, that I was stuck with this code base that was like Knockout models, or sorry, Backbone models and Knockout JS, which is fine. We like the patterns generally, but it gave me a lot of chance to refine and reflect, which is why is how I created SolidJS was basically trying to do that. And then React came out, and React was like it basically killed this model dead. They basically view this as something they fixed. I had some fun with the drama on Twitter because you can see it in the way they talk about it. They're like, yes, we fixed this problem. It's like the go-to a programming and stuff. And it's like, I don't mean that to be insulting, but we've evolved past it. It's like okay, right? Sure. I was like. I still like this. I was actually kind of fine. I was like, fine. No one's going to like this. I'm just going to continue doing what I'm doing and essentially building on that is where Solid came from. And I had a steep hill to climb because I was, like, everyone kind of decided that. So I worked on benchmarks and performance. I was like. I took every single situation where people had shown that the VDOM is fast and been like, okay, can this be done with a reactive system? As it turns out, it can. A lot of people kind of given up. They're like, okay, well, this is kind of just a pendulum, or people kind of go, like, overcorrect. That was essentially my sense of things. So I was like, we can actually work on the problems that we have today instead of completely replacing it. It's funny. This is the justification I hear whenever I'm like, hey, try SolidJS. They're like, no, we can fix React. React doesn't actually need fixing, to be fair. It's just a different paradigm on the opposite side of the spectrum. But it is one of those things where I was like, okay, let's work at this. And that's good because it gave me, while I had the real experience working at a company, working on actual projects, delivering to production, having to maintain it, it also gave me a chance to look at stuff in a wider lens and kind of make decisions on how things should maybe work and kind of like hypothesize on that. And I did a lot of benchmarking and a lot of verification to try and decide. The approach made sense. So it was a combination of me just loving the developer experience of dealing with signals, so to speak. Like, just the way the control flow works. Again, it reminded me of some of the programming I'd done when I was younger and a bit with just making that performant. So both of those things were very sources of passion for me to let me explore a wider range of solutions, which is kind of interesting now because I realized because of the benchmarks thing with benchmarks is everybody gets in those benchmarks. So I started being like, oh, Svelte has an update updated? Oh, the vanilla JS version. Like, the baseline isn't fast. Other libraries are catching up to it. Can we make it faster? I got a lot of experience again with toy demos, so to speak, but playing with different scenarios and different frameworks to the point that, at one point, we started trying to categorize all the frameworks in the benchmark in terms of what they did or rules of it. And I was able to spend an afternoon and go through all of them, including ones that I didn't know. So to the point that I could basically categorize or explain how the 80 different frameworks in the JS framework benchmark worked. So it gave me a really wide view to kind of decide how I'd approach development. And at the beginning here, obviously, that was just aiding my work with Solid, but it ended up giving me an opportunity to help others, which has been really cool because I know I'm just like rambling. But essentially.

**Chuck Carpenter:** [24:17] No, not at all.

**Ryan Carniato:** [24:18] We've seen this kind of sense that there's new stuff and new places we can take front-end dev. Over the last couple of years, we've seen this evolution, people trying to solve different categories of problems, especially things that are kind of weaknesses, classically of single page apps. And I've realized a lot of the work I did to kind of look at all the different frameworks and try and take that all in kind of helps in terms of being able to kind of find common ground between those and start a conversation with different authors and figure out how we could collectively push the web forward. So that's been a large part of what I've been doing, especially since I've had the position at Netlify to be able to work on it full-time.

**Chuck Carpenter:** [25:01] Right.

**Ryan Carniato:** [25:01] Because I was with the builder guys building server-side benchmarks with Quick so that we could see what the trade-offs for resumability were. These kind of opportunities working with the Astro guys to kind of start flying, like just kind of like spitballing, like, what would it look to add a client-side routing in Astro if you wanted that?

**Chuck Carpenter:** [25:19] Right.

**Ryan Carniato:** [25:19] These are the kind of avenues that we can explore. There's a lot of really cool innovation happening right now. And there's always the cycles where things kind of like, how should I put it? Like, consolidate on single solutions. We've been on a single solution really for five or six, seven years. People are looking at different solutions right now. I'm not saying that that makes, say, React any less relevant. It just means that there's a sense and a feeling out there that people are looking for maybe alternatives just so they can evaluate it. Because React itself is changing. So when someone goes, hey, there's this new thing in React, how do you put any value on it? On one hand, you've been fine saying, you know, I'm happy with what I've been doing, but if you have to make decisions again, if you have to stick to a point where you actually have to evaluate where things are heading, you can't do that without having alternatives.

**Chuck Carpenter:** [26:10] I agree with that. And I agree it's essentially like a question-everything mantra. And I think that I really appreciate that you're in a position to not say, listen, I have this deeply ingrained I've determined this solution. And I believe at the end of the day, now, five years from now, ten years from now, it's what's going to be the end result. And it could be, and it may not be, but I think that the misnomer is that we've answered this question. Why are we going back to ask this question again? And in the context of the Astro, guys, this is what we really love about that, is in the fact that they've said that, yeah, we got away from server-side render, and we got away from just like HTML as a first-class citizen because blah, blah, blah. But a lot of those things aren't true anymore. Like, the cloud provides you really powerful machines. Servers, even on-prem are powerful machines. And yes, even the client provides you some powerful machines. But should we be giving it all of the processing power? Because we're not as concerned with cost and all of those things. So let's just look at the context of what we're trying to do with the user and say, like, maybe we just server-side render a thing. It's not so bad. Oh, we need to do a little more with that because it's a highly interactive application, great. But let's not just say Create React, app, or even Next.js hot take is the solution for that. Because I think Next is great, but I also think that it's highly engineered for its own platform. So then again, does it solve all the problems there? Yes and no, because again, it's very dependent on React, which was a very single layer. It did a very single layer very well. So I was part of the team that did a Backbone marionette application at National Geographic. Loved that shit at the time. And then, when I got to do a React component that it's almost like made me feel a little bit like the story with your dad where you were able to real-time see those updates without depending on jQuery or whatever weird DOM manipulation thing. I was blown away. This was awesome. But then this was also like 2014 or something, so we're not in the same place anymore. Right?

**Ryan Carniato:** [28:20] Yeah.

**Chuck Carpenter:** [28:21] And continuing to ask those questions and just say, what's the best tool for the job? What, at the end of the day, is the simplest tool for the job? For people later on. Right. The bus syndrome. People later on who are responsible for maintaining an application and not having to fight for a rewrite because things don't make any sense anymore. Right. Like those kinds of things. I think that's why I completely agree with you and love that you're just continuing to ask those questions, and then if you come back to the same answer, that's great, but you might not sometimes.

**Ryan Carniato:** [28:53] Yeah, it's tricky because, yeah, it's constantly moving, which seems weird. It's funny because we always get the back end. People being like, hey, we haven't changed this in years. Why are you guys so volatile? And it's like what we're capable of changes considerably with the advancements of devices. Our biggest bottleneck is the network and the devices that are in the user's hands. And I think that changes perspective a bit. It's also our biggest restriction, and I think it's easy to dream ahead and then be like, look, in some idealistic future, we can do everything. So we constantly have this tension between getting to that future and not quite making it today and being practical about it. And I mean, that's an engineer's job to kind of discern that kind of information. And from that perspective, it's hard to ever say absolute or sure things because you know that it's changing under you, so to speak. So I sometimes kind of push off the comparison for that reason because it's like you can't compare those things. You got to make what's practical for you. So I can never be too mad at someone, say, for choosing React from a practicality standpoint. But on the other hand, you do have to consider the fact of maybe you should consider it shouldn't be just the default choice. You should consider what you're trying to accomplish. And the difference between today and the future is a real thing. And yeah, I mean, there's no way you can look at this without putting amount of preference in there, like things that you like or patterns that make sense to you. We carry that with us. And then I think that's probably the biggest deciding point because truth of the matter is any modern JavaScript framework does decently well within the boundaries of what the framework is designed for. I think what's interesting now is we're moving beyond those boundaries. We've kind of got to a point, and this happened years ago, but people are like, yeah, I want to use React for my content site or whatever Vue or whatever single-page app thing. And it doesn't always make sense for those situations. You can use it for a blog site and not make a ding because that's like small time. But generally speaking, these were built for applications almost to compete with mobile in a sense. And it's not the same kind of requirements you need for, say, accessible government site or for, say, an e-commerce site, which is something I had a little experience with working at eBay. So it's interesting because, over this evolution, this is why I look so wide, because you start seeing the same patterns. People talk about React server components. There's a lot of similarities there to the island’s framework. It's for React, and it solves stuff in a way that I think is beneficial in maybe a different segment or even a wider segment in terms of being able to extend to more app-like applications. But generally speaking, the core mechanisms for server components, like how you author restructure app are actually very similar to islands like Astro. And if you look at Astro and Islands, you can go further back on there. It came popular obviously around 2020 when Jason Miller made that Islands article, and everyone started playing with that. But like Marko, which is Ebay's framework, had that capability since 2014 and out-of-order streaming, all the stuff that we thought was really cool about kind of coming in modern was something that they had because they had that problem. So as we're widening the scope, we can look in the domains of people solving for the specific solutions. Like someone's probably solved that problem for you already. And I feel like reactivity was another one of those things where signals and Solid kind of came in. It was like it was designed to solve a certain type of problem, synchronization problem. And while in a sense React with its declarative views approach, I mean, to be fair, these are all declarative, but with its rerender model, kind of immediate mode from a graphics perspective, kind of simplified things to a point where maybe you don't have to worry about it. At a certain point, you always have to worry about it. Right. And I think one of the interesting things about the web is being so constrained by the device and the network. Something out of our control has to give us a lot of consideration, which is actually interesting because, in a certain way, it isn't unlike game programming. You can't change the hardware of the users you have over time. You know that they'll get better graphics cards. But generally speaking, we are actually still developing for that specific platform, and over time we hopefully find ways to conquer the divide between developer experience and user experience in a way that is agreeable.

**Chuck Carpenter:** [33:37] Yeah, that's an interesting thing. And it kind of like harks back to the browser wars in a way or whatever, where you're developing to the lowest common denominator of your user base, right? You want to look at those metrics, and you want to say the majority of these people need to be able to accomplish the primary tasks to make this application or site successful. So that kind of makes sense in a lot of ways, and yeah, so it's always about the best tool for the job into what your major business goals are, right?

**Robbie Wagner:** [34:07] Yeah, well, I think React did it the easy way, where it's like, let's just update everything, right? And that works. That's easy for people to learn. It's like, this is just going to always update, and it's going to work and whatever. But being declarative about these are the things that will update with signals is just like a better mental model. I feel like you don't want to have to turn off all the things that aren't going to update. Just tell it the things that should update. So it's like they both perform well if you know what you're doing. But the problem is a lot of people go to boot camps or whatever and don't know what they're doing. So they make really things that aren't that performant.

**Ryan Carniato:** [34:45] Yeah, the interesting thing here is that when talking about the ideal versus the practical, and this is why Solid kind of sat as something I was just playing with, and I didn't open source or didn't care for the longest time. Although I moved to open-sourcing before hooks came. But the thing is, I have no argument against if you watch like React talks from 2015 or 2014 when they're introducing it. There's a reason why a lot of again, I'm going to use game programming as an example. Almost all game engines work in immediate mode. Like that idea that you could just blow away the view and just create it again, even though retained mode, which is like the DOM, where you can actually keep a model mutated in memory, is way more performant, is just easier to deal with all that synchronization over time. We optimize, and under the hood, we actually want a retained mode. But generally speaking, there's something very simple about just blowing it away. Despite all of that, what ended up happening with React is we got hooks, and hooks look a lot like reactive systems. It's funny because I get a lot of flack with Solid for the JSX thing where people like, oh, you're just like React because of that. I don't mean flak. It's more like confusion where they're like, oh, it's all like a better React. You try and prove upon React, and it wasn't true. I was doing this before React hooks and all that. JSX was just convenient because of the composability had all the tooling. I was like, yeah, that's a good choice. But in a sense, reactivity had hooks before hooks. So if you pick up a 2010 Knockout thing, it has state and derived state and effects. Like it has those things. They didn't call them the same, but they have those things, and Solid is very similar to that. So in a sense, as soon as React got to a point where you needed to start thinking about how things updated because you have hooks and dependency rays, and got to a point where it's funny because there are functional programming, like classical functional programming, things that map to that. But in JavaScript, we had these reactive systems, and I think when hooks showed up, a bunch of people are like, oh, this clicked for them. Like, oh, this reminds me of that old Knockout app or whatever that I was doing before. And it's not quite the right connection, but it's the same reason why Svelte 3 happened because of React hooks. To a degree view. Composition API happened because of React hooks. Technically, Vue has had this reactivity also from 2013 or 14, whenever it came out. But they finally unleashed it because there's like this perspective in the ecosystem. This is a big thing about being like the big player is you can kind of push the narrative just by, like Marko can go build server components and out-of-order streaming. No one cares about it until React 18 comes up. I think it's interesting because React itself, even though there's a way I could justify it from a pure functional programming standpoint, being still true to the original vision. It's actually compromised a bit because an example of this is suddenly references stable references matter. That's why use callback exists. Like if you take a value and put in the dependency rate, it has to be equivalent for it not to rerun again. So like, structural cloning is a thing. Early days of React, you didn't care about any of that stuff. You literally just blew it up and continued. I think React today is actually more performant because people have adopted this abstraction. But generally speaking, we didn't realize how awkward some of our React apps were in the past. Hooks actually made it kind of like shun a light on that and, in a sense, given us the tools to actually improve upon that. But it also at the same time kind of goes like, okay, if you're going to do this and you're going to care about this, maybe React system that's actually built for this specifically, like, you know, the signal stuff actually makes sense. So it's it's kind of interesting. I found myself very much in that place back in 2018 where React announced hooks, and I was just like, honestly, up to that point, I was just like, you know, it's fine. The the world's moved on when they did that. I just was in because I was just like, wait a second. Yeah, at first, you know, like some of the other people who were working on similar libraries were like, oh well, React added this. I guess my job is done. This is all I wanted. I wanted those composable primitives. I was like, no, this pattern or this abstraction might be actually more agreeable, so to speak because you don't have the same kind of hook rules. There are rules, but they're not the same hook rules. You're not fighting against the rerender model. And I understand this is so weird. Some people in the SolidJS community started terming stuff React brain. And I don't want to come off too harsh on it because I get it from a purely functional standpoint, but essentially it does take a little mental warping to consider that you have a function that reruns over and over again and that somehow persists state in the middle of it.

**Chuck Carpenter:** [39:35] Yeah.

**Ryan Carniato:** [39:35] That is a jump. The fact that you can have if you look at the dependencies almost as conditionals. That's why you don't have like nested ifs with hooks and stuff. You have that order, the dependency rays serve as that conditional. Then you have things that are kind of existing on a different branch that you don't run when you re-render. You took the if statement on one run on the other run. You just don't take that if statement and that kind of warping your head around that model is doable, but it is definitely a departure from the old Pete Hunt gets on the stage or Jordan Walke, and they're just like rerender everything. Don't care. You do care.

**Robbie Wagner:** [40:14] Yeah, it is fine to talk bad about React on here, just so you know. I do that a lot.

**Chuck Carpenter:** [40:20] Well, I think that if you came into the game early days and then you are in the game in hooks days, it is just a massive departure and disconnect in your mental model and how you would create performant applications. And I think that that's just basically the problem that I've had and only more recently really, over the last couple of years. It sort of was like, kind of okay for a while, and was doing a lot of replatforming projects within Next.js, and there were things I loved there and then things that wasn't their fault that came along with newer versions of React where I was like, man, I really knew how to make this good. And now I've got to think about it in this other way and not care about certain things, and it's kind of annoying to me. So at the end of the day, Next is the super framework for React, and I appreciate how it gave it some guardrails there, but ultimately I'm not sure that it's like my go-to choice for doing SaaS applications, for example. Right. I think that we're rethinking some of those things. So Ryan, aside from the comparisons, it just seems like frequently in discussions and comparisons from signals and hooks and everything else there are, you mentioned this in Knockout and other places where this pattern has existed. Unidirectional flow of data to me kind of made me think a little bit about how for a while at least, Ember JS was really talking about this whole data down, actions up, two-way data binding, bad, stupid components good. And I think that there's a tie to signals with that kind of ideology as well.

**Ryan Carniato:** [42:05] Definitely, React really popularized that directionality, but I would say I was an Ember developer as well for a while there. It was my first attempt at doing a proper framework that had all the pieces, and yeah, I think we all kind of realized around the same time, 2012 2013 period, that it was a little bit chaotic. Ember does have a reactive system. Like its computed properties and stuff are very similar to the earlier signal stuff in JavaScript. So I can see that kind of tie-in. I think it's interesting because, for a large part, we kind of just were like this is a problem. And then we were like, let's just throw away everything and start over again. When React kind of came in. And as it turns out, I think there's other solutions to this problem, and that's kind of where I am at with signals and where SolidJS where it's at just because there are different ways to approach it. And Solid, as I said, still abides that kind of unidirectional flow. Read, write segregation. It's important. I think it lets you reason about how data flows through your applications, and that can be true with signals or otherwise.

**Chuck Carpenter:** [43:15] Yeah, completely agree. How about we move into a little what notty kind of things? Unless you had anything specific there, Robbie, you wanted to throw in other than your head nods.

**Robbie Wagner:** [43:26] No, my brain is not really working at this moment, but.

**Chuck Carpenter:** [43:30] Cool.

**Robbie Wagner:** [43:31] I mean, just to kind of tie it into Ember, the newer stuff has tracked properties, so it's kind of like using a signal to mark a thing that is going to change. So there is some similarity there. But yeah, I think for those coming from Ember, if you were looking to learn something newer that's a little bit different syntax, I think using signals and solid makes a lot more sense with your mental model than all the hooks in React.

**Ryan Carniato:** [43:57] Yeah, it is an interesting one because, personally, this always made sense to me because that's where I started from. But I had a great conversation with Dan Abramoff in the comments of one of my articles recently where it didn't occur to him that people would look at hooks and see signals, which it's interesting because I guess there's some functional programming academia kind of area where these kind of semi I don't want to call it feels like it's impure. Because if you have a pure function, you should be able to retain state each time. But it's also like they have mechanisms and names for this that have nothing to do with reactivity. But when you look on the reactive side, there's a whole history of these kind of composable patterns. So I think it's interesting to see how this develops over time because my suspicion is that what we're just seeing is a common language like these pieces of state-derived state and effect, or I guess derived state some people call memo, is basically common throughout all the JavaScript frameworks. Now, now that you have Angular picking up signals and even self-compiled language React hooks, they all look kind of the same but behave a little bit differently. It's going to be interesting to see how much of this is actually just implementation details. The fact that we're all trying to fight around the fact that JavaScript is not like a control to our dataflow language and that we're trying to justify that in some sort of way or figure out how we can manipulate it to our needs. But I think in general, we are seeing that there is a certain language to UI, and with further work into the future with compilers and whatnot, we're going to see new ways to make that language, I guess, more accessible.

**Chuck Carpenter:**[45:41] Yeah. It's almost like we're all starting to agree.

**Ryan Carniato:** [45:44] Yeah. Which is kind of crazy.

**Robbie Wagner:** [45:45] Let's not go that far.

**Chuck Carpenter:** [45:47] Let's not go that far.

**Robbie Wagner:** [45:48] So, let's talk about punk bands. Tell us some more about, well, about being in that oh, you had something else to say.

**Chuck Carpenter:** [45:55] Yeah, I want to say it in a very specific way is that the Internet has a burning question as to what came first. Solid JS or Mr. Solid?

**Ryan Carniato:** [46:05] Yeah, Mr. Solid. Way outdates it. I started that band back in, I want to say 96, 97, I guess, really was when we cemented on the name. We didn't have a name, but yeah, I played in that band for a decade in various forms. It did change its name. We dropped the Mister at some point to just Solid. And we went from being kind of like oi punk rancid style to, by the end, we were playing Youth Crew New York Hardcore.

**Chuck Carpenter:** [46:40] Okay.

**Ryan Carniato:** [46:41] We did change the name at that point to break the chains, but essentially there was a long we evolved a lot over that time period, but it was like me and the drummer stayed together the whole time, and the bass player actually for most of it, too.

**Chuck Carpenter:** [46:56] Oh, that's pretty. I almost said that's pretty solid. But it felt too punny.

**Ryan Carniato:** [47:01] Yeah, there's no shortage of that. But yeah, no, I wanted to play music. I knew that for quite a while. And we just did it. We were like really young. We were like twelve years old or whatever, and we just started a band and then go to local all-ages shows and do that whole thing. And we kept at it for quite a while. It actually is funny how much guided decision making. My first vehicle that I bought was like a public transit vehicle. Like an ex-public transit vehicle. Basically like a minibus.

**Chuck Carpenter:** [47:38] Okay.

**Ryan Carniato:** [47:38] And that's what we used for touring and stuff. So it was a big part of my life for a very long time. We practiced tons, especially when we were younger, like four days a week. But the weekend practice would be like all day.

**Chuck Carpenter:** [47:51] Nice.

**Robbie Wagner:** [47:52] Wow, that's commitment.

**Ryan Carniato:** [47:53] Yeah.

**Chuck Carpenter:** [47:54] Are you still playing now any?

**Ryan Carniato:** [47:56] Not really. I managed to find like a different band to jam with right before I moved and COVID hit, but yeah, no, since I've been in San Jose I haven't played that much. I still got my Mesa Boogie sitting in the garage half-stack.

**Robbie Wagner:** [48:10] Nice.

**Ryan Carniato:** [48:11] Dual rectifier.

**Robbie Wagner:** [48:12] Dual rectifier? Yeah.

**Chuck Carpenter:** [48:15] I don't know what that is, but Robbie knows your vernacular there.

**Robbie Wagner:** [48:19] Yeah, I'm like what I used to have a dual rectifier and sold it, and then I don't know, I just started getting rid of my nice equipment because I was like getting less and less into being in the band.

**Ryan Carniato:** [48:30] Yeah, I still have a bunch of guitars and like a bass and acoustic guitar and stuff. Like, it all sitting around. I don't know. I need to clean it up at some point.

**Chuck Carpenter:** [48:38] And just bring back the saxophone. I think that's the key.

**Ryan Carniato:** [48:41] Right.

**Chuck Carpenter:** [48:42] It comes around full circle.

**Ryan Carniato:** [48:44] I did manage to back when we were doing the more oi punk kind of thing. We had some ska music and stuff. I did actually manage to do this saxophone piece. It was, I guess, our first CD. We did some mixtapes and stuff before, but our first album had saxophone on it.

**Chuck Carpenter:** [48:58] Nice.

**Ryan Carniato:** [48:59] With those, like, Ska songs.

**Chuck Carpenter:** [49:02] Yeah. Like Aquabats or something like that. I don't know. That's what I always kind of think of when I think Ska.

**Ryan Carniato:** [49:07] Yeah, no, I mean, it was definitely a time period. There was like a year, two years where it's just like everything it was.

**Chuck Carpenter:** [49:13] Almost like the reggae of punk. Okay, so my reference there is that reggae songs basically sound the same. It's almost like samba music or something. Yeah, there's certain genres that it's like there's an element of it that's exactly the same throughout the thing.

**Ryan Carniato:** [49:33] That's interesting. I mean, going there is, like I have no clue how punk crossed with it. Probably eighties, like The Madness or The Clash or whatever, got the punk crossover. But Ska music actually predates reggae. It was popular in Jamaica in the 1960s. And there is like a different rhythmic thing that you can tell the difference between the two. Although they're very similar, they both involve that kind of like but one's on the downbeat and one's on the upbeat. So it changes the feel of it. But yeah, somehow early Eighties, I want to say, punk rock bands just, like, started incorporating that into their music, and it came back again in around like 97. Right.

**Chuck Carpenter:** [50:16] Both times that were, like so, like, the popularization of punk in the early eighties or so because I was in like skate culture in the then. Yeah, that resurgence in the early to mid-nineties. And then I think it just kind of carried over with all facets of that. Not that I know that much about music, but.

**Robbie Wagner:** [50:36] Music was a thing that I was very interested in for a while. There was a time period where I really studied it to understand the history and where things are coming from. I actually spent a couple of years working in a record store doing that kind of thing. But yeah, those are the days.

**Chuck Carpenter:** [50:51] Was it called Top Five Records?

**Ryan Carniato:** [50:53] No.

**Chuck Carpenter:** [50:54] I don't know if you ever saw that High Fidelity. And there are, like, super record nerds in there. Yeah. That's what makes me think of when you're in there and having these internal employee debates about top five Ska records or whatever.

**Ryan Carniato:** [51:07] Right. Yeah. No, I mean, it's so funny when you're involved in music, like, that what matters. And these conversations are very important conversations and having the right opinions are very important as well. I got a little leeway being in a band and playing in a band. Surely there's a certain amount of knowledge that has to go there, but you sometimes get a little bit more slack, maybe. Perhaps.

**Chuck Carpenter:** [51:32] Yeah. As a maker versus, just as they say, like those who can't do teach, that kind of thing. Those who can't play, sell records. I don't know. Yeah. Any other hobbies? Sounds like you really deep dive in a couple of things. I don't know how much other time.

**Ryan Carniato:** [51:47] You have, but yeah, I mean, when I got out of music, I got way more into, I mean, this is such a generic one, but into hiking. That was actually one of the things I was most worried about when I moved to San Jose. Because back in British Columbia, in Canada, it was really easy. There's just tons of mountains. We just kind of just go pick one. Kind of go up towards Whistler or anywhere along there. Pemberton and tons and tons of hiking because of the coastal mountains right there. There's some okay hiking around San Jose, but it's not quite the same feel. But we do it and still with the family and everything. But we used to do a lot, not like going to Kilimanjaro kind of deals, but we used to do a little bit more ambitious hikes than we do these days.

**Chuck Carpenter:** [52:31] Interesting. We have got a lot of hiking here in Phoenix, but obviously, it's kind of the reverse timeline. Essentially. You love to do it in the winter, avoid it in the summer.

**Ryan Carniato:** [52:43] Got you. Yeah, that makes sense. That's what I've noticed since moving south. It's kind of like that. The winter here is so much nicer for that. Even right now, it's like, perfect. It's all green, and it's really nice. Whereas we hiked in the winter back in Vancouver. But it's like snow hiking. It's a whole other thing. And you got to be careful when you do that. But it's cool. You can chart basically straight over the mountain. Usually, when you'll go to the stuff in the summer and you'll kind of wind around and go up the trails in the winter, you can kind of just power straight through. You could just be straight up the mountain sometimes. But there's some safety concerns there.

**Chuck Carpenter:** [53:23] Yeah. You learn how to survive an avalanche, potentially.

**Ryan Carniato:** [53:27] Yeah. Or get good toe holds when you're, like, scaling something. Hopefully, it's not too icy, like it hasn't frozen over anyway.

**Chuck Carpenter:** [53:37] Right.

**Robbie Wagner:** [53:38] You need some ice picks. Do like the ice climber style.

**Ryan Carniato:** [53:42] Yeah. And also, don't never go near the edge or thing. That's a story we always had. Every year there's something that happened where someone got too close to the edge, and the whole side just came down. You'd always hear stories. So yeah, just be safe out there.

**Chuck Carpenter:** [53:56] It's not a pleasant way to go, I don't think.

**Ryan Carniato:** [53:59] No.

**Robbie Wagner:** [54:00] Yeah. There's a lot of that, though. People not even just in snow, but people go to the Grand Canyon or whatever and want to get a nice selfie and just fall over the edge. Just take that from a little bit further.

**Chuck Carpenter:** [54:11] Yeah, there's a wind gust or something, and they're like, use some angles, and they're like, zoom in, so you seem closer.

**Robbie Wagner:** [54:17] Yeah, I'm going to be far enough away that if I fall all the way straight down, all of my body is still on land. That's my rule. I used to do that at the Metro in DC. Waiting for the Metro to come. If someone pushes me over, I don't want to be able to touch the Metro at all. So be really far back.

**Ryan Carniato:** [54:36] That's probably a good rule. Yeah. No, snow adds a whole other dimension of it, though, because you can't tell it'll overhang. So it goes further than the actual edge of the ground.

**Robbie Wagner:** [54:48] Right.

**Ryan Carniato:** [54:49] Yeah. Anyway.

**Robbie Wagner:** [54:49] Yeah, it makes it hard.

**Chuck Carpenter:** [54:50] No, I think that's solid. Oh, my gosh.

**Robbie Wagner:** [54:53] Solid.

**Chuck Carpenter:** [54:54] I think that's excellent advice. Yeah. No, I think I've just ingrained it in my brain. Subconsciously, all things are solid.

**Ryan Carniato:** [55:03] Yeah. I don't know. Other than that, those are big things for me these days. I spend a lot of time working on open source. More hours than the work week, definitely.

**Chuck Carpenter:** [55:13] Right.

**Ryan Carniato:** [55:14] That's why I like hiking. I actually leave the phone. Just turn it off. I am gone during that time period. Yeah, that's where I was actually this morning. On Thursday, I do take a little break, and I go hiking with my wife.

**Chuck Carpenter:** [55:30] I think that's excellent for advocating for mental breaks, forced mental breaks against all screens, and get a little nature fresh air. And it's surprising how much that can refresh your brain and give you new ideas if you just don't stare and think about something constantly.

**Ryan Carniato:** [55:48] Most definitely. Yeah. I've found that over and over again because most of the work is for me, at least, it's the thinking, like making sure that it's funny how much time I spend, like brainstorming or jotting notes, versus actually writing code these days. Other than it's funny you work on open source. I don't know if people envision it just sitting there writing code, but when projects get more popular, you find you're doing more administration anyways, it starts becoming less different than work. It becomes like almost like being a team lead or team manager or whatever. It's the same kind of thing. So between that and making sure you have brainstorm time, the actual coding time is like that point where you're just like, okay, I've been thinking about this long enough. I think I'm ready to go.

**Robbie Wagner:** [56:34] Yeah, I think I've been realizing more and more that I probably have ADHD or something and can't focus on stuff for that long. So I like short little bursts of tasks. If I'm going to contribute to open source, I want to be able to open it and work on it for an hour or two and back away. That's my perfect kind of setup there.

**Ryan Carniato:** [56:54] I think for me, I needed to figure out a way to break stuff apart because otherwise, I get stuck on, like, a task for very, very long. Sometimes the task is actually giant. Like when you're like, oh, how do I add some huge feature? Like, I don't know when we first added universal rendering that's like the ability to support, like, Solid Native or three JS or whatever, a whole different renderer. How do you just sit down and just design that out and do it all that time? It'd be very tempting to just stay on my computer and just not sleep and just power through it over and over again. So I needed to get used to being like, okay, I'm going to attack this in boxes, in steps because it's different when you don't have the boundaries. I think a lot of people when COVID came around, had to learn this for the first time because there's the old leave the office kind of thing, and then they're working at home, and then they're understanding this. This is something very true, especially when it's your passion project. You really do have to find a point where you're like, okay, I'm going to accomplish this much today and be okay with that.

**Chuck Carpenter:** [57:58] It's a lot of self-discipline, essentially, around that, right? Like, ride the wave for a bit, but also force yourself to chunk it up, and then instead of sitting there for 18 hours and waking up and realizing it's Friday night.

**Ryan Carniato:** [58:14] I know there's developers that do that. I've been that developer in the past, but it's just not me anymore. I always got that impression from Jared, from Bun. Maybe not so much now because he's running a company, but the year or so before Bun went open, went public, I definitely got the impression whenever I talked to him that he'd just gone at it. Sometimes when you have that period in your life when you can do that, you can accomplish incredible things in a short period of time. I don't think it generally is sustainable. You got to find new patterns. And for me now, as I said, work on SolidJS. It's been like seven years, so finding a balance is really important.

**Chuck Carpenter:** [58:52] Yeah.

**Robbie Wagner:** [58:53] You have to realize that everything in the virtual world can be infinite. You can always find new stuff to do. So I try to get stuff in the real world done first. Like, oh, the dishes need to be done. Let's do that. And then I can spend all of the rest of my time because you could go down a rabbit hole and never leave your computer.

**Chuck Carpenter:** [59:11] That's true. That's why I make my bed every morning, actually make the bed every morning, because I know it's like one check mark I can give myself. Like, I will get this done today for sure.

**Robbie Wagner:** [59:21] Yeah. And if you don't, it's a bad day, right?

**Chuck Carpenter:** [59:24] And it's a real bad day. That just means I'm not getting out of it usually. Not that it happens so frequently anymore, but yeah, I definitely understand that. Your body, your soul, basically only has so many of those. Just go at it for as long as possible.

**Robbie Wagner:** [59:41] Yeah, it's the spoons.

**Chuck Carpenter:** [59:42] Yeah. It makes me think of, like, when I was younger or, like, early teenage, playing video games for hours and hours on and playing. There's this one called Chrono Trigger. And I remember I had that very same moment of, like, I was playing this game, playing this game all through the night and whatever else. Maybe fell asleep here and there for like an hour or so. And then someone asked me like, hey, are you going to go out and do anything tonight or whatever else? And I'm like, what day is it? Oh, it's Friday night, that kind of thing.

**Ryan Carniato:** [01:00:13] I mean, Chrono Trigger is the best JRPG of all time, so I can appreciate that.

**Chuck Carpenter:** [01:00:18] That I had to get it.

**Ryan Carniato:** [01:00:19] Okay, saying that it's pretty spicy, but yeah, no, that game was incredible.

**Chuck Carpenter:** [01:00:24] Yeah.

**Ryan Carniato:** [01:00:25] That's actually one thing I'm a little bit sad on in terms of all the different hobbies. I used to play a lot of JRPGS and RPG games, and I never have time. It's like I find this little window. I managed to start up better for social side playing DND online with a group of people. So we try to stream every Tuesday to play DND on Twitch. That's like where I get a bit of that kind of back in. But yeah, I'm big RPG fan, which is fun because those games take forever. And again, it's an exercise in small time increments. And going back to it, I started the Witcher 3 a while ago. I'm still playing it. I've waited so long that they've actually gone to a point where they've released the high-res rerelease version by this point.

**Chuck Carpenter:**[01:01:10] Nice.

**Ryan Carniato:** [01:01:11] Yeah.

**Robbie Wagner:** [01:01:11] But you know, did you get sidetracked playing Gwent? Because that's what happened to me. I stopped wanting to play the real game because this card game is so fun.

**Chuck Carpenter:** [01:01:19] Right, you mentioned this before. Yes, I still haven't gone in there.

**Ryan Carniato:** [01:01:23] I haven't so much, which you'd think I would because I was a big Magic Gathering player when I was younger. I was really into it, competitively. That's where I got into writing, actually. I was writing strategy stuff on MTG Salvation forums and stuff and answering questions, and stuff and designing decks, and you think I could get into Gwent? But the funny thing is I also played Final Fantasy 8, which also had a card game. And I recognized pretty early on I was like, man, if I get into the game, then I won't finish the actual game. So I played Gwent in the beginning when they first forced you to learn the game. I have not challenged anyone, or I failed all the quests there because I'm just like, no if I go there, I will never actually finish the game.

**Chuck Carpenter:** [01:02:02] That's fair.

**Robbie Wagner:** [01:02:03] Yeah, that's what happened to me.

**Chuck Carpenter:** [01:02:07] That's why you will never finish that game.

**Robbie Wagner:** [01:02:09] Yeah. I just fall off of games. I tend to not finish them because if I get 60% of it done and I've enjoyed it, then I'm fine. I don't need to check all those boxes.

**Ryan Carniato:** [01:02:19] Yeah. I need to finish it. This necessity. The challenge is like, I've given up 100%. When I was younger, I was like, oh, no, I need to get all the secrets. But I'm okay now, missing stuff. It's my play-through. I don't have to follow the guidebook, so to speak. But yeah, I won't move on to the next game. I'll have, like, two games maybe going on at time, and I kind of justify it by having them under different categories, like retro game, modern game. Like, okay, I can have two games. Yeah. I won't pick up a new game of the same category until I finish the previous one.

**Chuck Carpenter:** [01:02:55] Yeah. Okay, that's fair. I think the last one, well, yeah, the last one I would have finished, like, that was Skyrim. I had to finish it. But I also didn't finish some of the quests because I wanted to keep my group as big as possible. So I wanted, like, thieves and vampires with me so I could just crush people. And I want to finish those particular.

**Robbie Wagner:** [01:03:13]So they won't leave your party?

**Chuck Carpenter:** [01:03:15] Yeah, they don't leave my party at that point if I don't finish their story, but I still take my story and kill the big guy and win the whole thing. I feel good about that.

**Robbie Wagner:** [01:03:24] That's fair.

**Ryan Carniato:** [01:03:25] Yeah, that works. But yeah, I mean, [unintelligible], there's a time where I was able to keep up, and I remember being like, oh, no, when's the next game going to come out? These days it's not like that these days. It's like I have a long, long list. I'm trying to think the newest game I probably played to the end and beaten was Breath of the Wilds. And we're already getting to Breath of the Wilds 2 this year.

**Chuck Carpenter:** [01:03:46] Right?

**Robbie Wagner:** [01:03:47] I'm excited for that.

**Chuck Carpenter:** [01:03:48] I will dive into that as well. It's basically the only reason why I kept a switch during the pandemic, which I hear is still happening. But I was going to sell one because it was like, these things are selling for, like, crazy money. All I do is play FIFA on it periodically. I'm going to sell this. Oh, wait, I heard about Breath of the Wild 2. Done. Never mind keeping this thing.

**Ryan Carniato:** [01:04:08] Yeah, it's going to be a good year. On that side, there's a bunch of titles. I got back into Mario Kart because of playing with the kids. They get to play Mario Kart, and they've been releasing these expansions on Mario Kart 8. So there's like every three months there's two new sets of four courses, and they did that all through last year, and they're doing it all through this year. So some retro courses being brought back from older games plus, like, some new courses. So there's another six times four levels coming out from Mario Kart this year.

**Chuck Carpenter:** [01:04:40] Okay, I'm going to look into that. My son is six and a half, and we played some, but he doesn't play it very seriously, so we haven't really come back to it very much. But this sounds like maybe an opportunity to revisit.

**Ryan Carniato:** [01:04:51] Yeah, so good stuff. Breath of the Wild 2. Super Mario Maker 3, though. I didn't play Super Mario Maker 2, so I don't know what the deal is, but yeah, I don't know. A lot of Nintendo stuff.

**Robbie Wagner:** [01:05:02] Sounds like work. I want the levels to exist for me already. I don't need to make them.

**Ryan Carniato:** [01:05:06]Yeah, I'm actually probably more excited about the streaming side when my kids are very young. That's how I got into Twitch. I was watching Live Streamers play video games, so Mario was a big one too. A lot of primary colors and stuff. I don't know. I'm pretty excited to see if some of the old Speedrunners come back for that kind of thing.

**Chuck Carpenter:** [01:05:28] Yeah, for sure. Anyway.

**Robbie Wagner:** [01:05:30] All right, we're at time here. Is there anything we missed or stuff you want to plug before we end?

**Ryan Carniato:** [01:05:36] We talked about a lot of different things. Honestly, people obviously check out SolidJS. SolidJS.com, join the Discord, on GitHub, all that stuff. I think we're doing a lot of really cool things and starting to see the impact of that across the ecosystem. So, yeah, I'm pretty stoked if people come and check it out.

**Chuck Carpenter:** [01:05:57] Cool. And find Mr. Solid on Bandcamp.

**Ryan Carniato:** [01:06:00] Yeah, we managed to put up a bunch of our old recordings, so yeah, there's like five albums worth of stuff up there, so yeah, check it out.

**Chuck Carpenter:** [01:06:00] Why not? Nice.

**Robbie Wagner:** [01:06:08] Cool. Thanks, everybody, for listening. If you liked it, please subscribe. Leave us some ratings and reviews, and we will catch you next time.

**Chuck Carpenter:** [01:06:18] Thanks for listening to Whiskey Web and Whatnot. This podcast is brought to you by Ship Shape and produced by Podcast Royale. If you like this episode, consider sharing it with a friend or two and leave us a rating, maybe a review, as long as it's good.

**Robbie Wagner:** [01:06:33] You can subscribe to future episodes on Apple, Spotify, or wherever you get your podcasts. For more info about Ship Shape and this show, check out our website at shipshape.io
