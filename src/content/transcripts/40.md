**Robbie Wagner:** [00:09] What's going on, everybody? Welcome to another Whiskey Web and Whatnot with myself, Robbie Wagner, my co-host, as always, Charles William Carpenter III, and our guest today, Godfrey Chan. How's it going, Godfrey?

**Godfrey Chan:** [00:23] Good.

**Robbie Wagner:** [00:24] Good, Good. Thanks for coming on.

**Chuck Carpenter:** [00:26] Welcome.

**Robbie Wagner:** [00:28] People that are familiar with Ember have probably heard of Godfrey. He's been around doing lots of things, giving lots of talks, building lots of the internals of all the Ember goodness.

**Chuck Carpenter:** [00:41] Wait, you're not the voice of the parrot in Aladdin. That was too weird. No? Gilbert Gottfried.

**Godfrey Chan:** [00:48] Oh, yeah. That might or might not have been a side gig I picked up, but I have no memory of that.

**Chuck Carpenter:** [00:56] Fair enough. Yeah, I should have read the show notes.

**Robbie Wagner:** [00:58] But yeah, I guess other than the things I just mentioned or including, maybe I should have let you say all this, but maybe give the folks a little intro into who you are, what you do.

**Godfrey Chan:** [01:08] Yeah, I am on the Ember core team. Previously I was on the Rails core team as well. People are familiar with Ruby on Rails. I think a lot of Ember developers came from Rails, at least at the time when I started doing Ember. I think that was kind of a popular thing at the time. I work at Tilde. We're a small company. We have, like, a few people in Portland, and then we have Peter in Orange County, La, California. That's I guess who I am as far as work goes. Right.

**Robbie Wagner:** [01:45] Cool.

**Chuck Carpenter:** [01:46] We'll ask non-worky things later.

**Robbie Wagner:** [01:48] Yeah. So we always start with a whiskey, I think, was the last one. We did another nonalcoholic one. Chuck or no, we did one in between.

**Chuck Carpenter:** [01:56] Yeah, we did just us in between. But our last guest was also a nonalcoholic whiskey.

**Robbie Wagner:** [02:02] Yeah. So we have another one today. It is the Lyre's American Malt. This one seems like they don't really talk about like the other one was very proud of. Oh, we distill it all, and we use this process, and like told you about how they did it, whereas this one is just like we've got some ingredients, and you should try it.

**Chuck Carpenter:** [02:22] Yeah, it's a little more secret. Zero calories, though, which is interesting.

**Robbie Wagner:** [02:26] No, three calories.

**Godfrey Chan:** [02:27] It's impossibly crafted.

**Chuck Carpenter:** [02:30] Mine says zero calories. Zero?

**Robbie Wagner:** [02:32] Really? Mine says three.

**Chuck Carpenter:** [02:34] Serving size, one full.

**Godfrey Chan:** [02:35] Oh, yeah.

**Robbie Wagner:** [02:36] Really? Do you guys' say zero?

**Godfrey Chan:** [02:38] Mine also has zero calories. We have different versions.

**Robbie Wagner:** [02:42] These are different labels.

**Chuck Carpenter:** [02:45] They sent you an old one even though you ordered all three. Right.

**Robbie Wagner:** [02:48] Or you guys an old one and me a new one.

**Chuck Carpenter:** [02:51] Yours has some calories.

**Robbie Wagner:** [02:53] Interesting.

**Robbie Wagner:** [02:54] Mine is manufactured in Australia. I don't know if that's the case for you.

**Robbie Wagner:** [02:57] Same.

**Chuck Carpenter:** [02:57] Yeah, I don't know. Storage; use supplied cap to reseal. There's not a lot of info on here, but I don't know. It's an interesting beer label with some little pop guns on it. It's impossibly crafted, but it is possible because it's in my hand. Yeah. So we don't have much info about it in terms of how they made it, but modern alchemy and old-world magic, apparently. Yeah. Let's open her up.

**Robbie Wagner:** [03:24] They include a 15 minutes mixology class so you can learn how to use all of their stuff. I haven't done it, but.

**Chuck Carpenter:** [03:36] I didn't even see that info. But we have our special glasses that we try, and not that that's a required thing, but.

**Robbie Wagner:** [03:45] This does smell a lot citrusy-er right now.

**Chuck Carpenter:** [03:49] I get a little citrus, a little like, I don't know, fall leaves or something.

**Godfrey Chan:** [03:55] My vocabulary is probably not good enough to describe what this is, but it tastes like a whiskey, just not alcoholic.

**Chuck Carpenter:** [04:04] All right. Have you had regular whiskey?

**Godfrey Chan:** [04:07] I had sips of it here and there, so taste vaguely. I don't know if we still have it, but we have a place called the Whiskey Library in Portland.

**Chuck Carpenter:** [04:19] Didn't we go there?

**Robbie Wagner:** [04:20] We have been, yeah.

**Godfrey Chan:** [04:22] Yeah, I've been there once with other people, but it was a pretty cool place. It's literally a library of whiskey.

**Robbie Wagner:** [04:29] Yeah, we should open one of those after we get all these whiskies for the podcast.

**Chuck Carpenter:** [04:33] Yeah, perfect. In Middleburg or elsewhere?

**Robbie Wagner:** [04:37] Probably elsewhere.

**Chuck Carpenter:** [04:38] Yeah.

**Robbie Wagner:** [04:38] Anyway.

**Chuck Carpenter:** [04:39] If you want.

**Robbie Wagner:** [04:40] I think this one tastes better than the previous one.

**Chuck Carpenter:** [04:43] Yeah.

**Robbie Wagner:** [04:43] It has a little bit more like smokiness and spice to it.

**Chuck Carpenter:** [04:47] Yeah, I get a little bit of cinnamon on the finish. I don't know if I'm getting smoky. I get citrus in both smell and taste and then more leafiness or whatever woodiness in the smell as well. I don't know. I make this all up too, by the way. There's no real vocabulary. It's just whatever. This is what I think citrus rinds taste like, and so I used that as my vocabulary, but that could be different for every person anyway. I don't think this is bad, but I think at the end of the day, it probably tastes kind of like a basic whiskey if you pulled the burning alcohol out. Right. So that's probably not incorrect.

**Robbie Wagner:** [05:24] Yeah.

**Chuck Carpenter:** [05:25] Unfortunately, the burn is part of the fun for me. I want to know I want a little punch in the throat.

**Robbie Wagner:** [05:30] Want pain.

**Godfrey Chan:** [05:31] Yeah, they kept a little bit of that in there, and I was looking at the ingredients and trying to figure out did they add something in to like fake a little bit of that, or is it something else in there? Like, maybe it's just the asset or whatever, but yeah, I don't know. Interesting. I didn't know nonalcoholic whiskey existed before you offered to send this to me, so thank you for introducing me to that.

**Chuck Carpenter:** [05:58] Yeah.

**Robbie Wagner:** [05:58] You're welcome. It seems to be a new thing that's kind of gaining steam because there's a lot of people that can't drink for whatever reason and still want to have some cocktails or something.

**Chuck Carpenter:** [06:08] Right.

**Robbie Wagner:** [06:09] Pretty cool.

**Chuck Carpenter:** [06:09] Yeah, it's interesting. So the cellulose gum is what I feel. One of the things I kind of taste it has the sort of, like, gum when it loses its flavor kind of taste to it a little bit to me as well. The other one had much more of that. This is more subtle. So to be fair to the other one, I would say this one is better in the world of whiskey or my need to consume this, though it's fairly low. I'd give it to you if I was in Portland, I'd be like, here, have a second bottle.

**Godfrey Chan:** [06:42] Hopefully next year we'll have Embercon back in person, finger crossed.

**Robbie Wagner:** [06:48] Yeah, that'd be nice.

**Chuck Carpenter:** [06:51] So we're very clever, and we use a tentacle scale of one to eight. So one being like, terrible thing you wouldn't want to have again, and you wouldn't gift to an enemy. And eight being like, this is great, I really enjoy this and would have this every day, or whatever it is. So I think basically, just as a social beverage, maybe you could just rate it in that way.

**Godfrey Chan:** [07:21] I don't have that much experience with whiskey, so I probably rate it relatively high. I think they're trying an interesting thing here, and they also had to figure out how to make it zero calories in our case or like three calories in Robert's case. So I don't know, like, maybe a six out of eight.

**Robbie Wagner:** [07:42] Solid.

**Chuck Carpenter:** [07:43] Yeah, I was trying to cast the net a little wider for you, like, oh, after work, whatever you would maybe have.

**Godfrey Chan:** [07:52] Yeah, a lot of times I do wish they have more interesting drinks on the menu that are nonalcoholic. Really. Because a lot of times like, oh, yeah, sure, let's go over drinks, but okay, I don't drink. And then what can I order in a menu? You can have like, a Coke or maybe if you're lucky a ginger beer, right? Yeah, I think you can definitely make some pretty interesting mix drinks here with this bottle here. So I would love to see them becoming more of a thing.

**Chuck Carpenter:** [08:21] I just snuck a mixer into mine because I wanted to be able to rate it on that level as well, too. And yeah, I added a little Coke, doing kind of a whiskey and coke thing. And that does taste kind of aside from the burn, that actually does taste more like I would expect that to be so this is a decent way to have it.

**Robbie Wagner:** [08:39] Yeah, so I mix some ginger ale and yeah, I think this is pretty accurate to normal whiskey and ginger ale. Honestly, I would give this, I think a five. I think I gave the last one like a three or something because it was very citrusy, but this one is pretty good.

**Chuck Carpenter:** [08:57] In that realm. I think I was going to say something similar like, oh, I don't want to have this all the time, but I can appreciate how it compares to actually having a whiskey and Coke, and I would suggest it. And so five sounds pretty good to me as well. I think I gave the other one like a two, which was maybe unfair in that I wasn't able to mix it. So perhaps I'll try that on my own and update our listeners my feeling on that level.

**Robbie Wagner:** [09:25] Cool, great. All right, so obviously the main things we're here for are Ember stuff like the new edition Polaris, which honestly sorry, let me get this correct, we just had a baby like a couple of months ago, so I missed a lot of EmberConf. I saw maybe a couple of highlights but did not watch like the keynotes and stuff. So for me and for those who have not heard about what Polaris is, give us the lowdown on what's coming and what's cool about it, right?

**Godfrey Chan:** [10:00] First of all, congrats on the baby. It seems like it's becoming a thing in the Ember community. I feel like every year we see babies popping up here and there. Congrats. Yeah. So for Polaris, I think I had one way to talk about it. I basically came up with how to describe it in my talk in EmberConf. So we can have links or whatever afterwards and people can watch that, but it's a hard thing to communicate, a hard thing to describe. So I had a few different ways that I was going to talk about it and some of them didn't make it in this talk. So maybe we can try some of that here and maybe that would resonate to some other people. I think if you have been around in Ember community for a while, in particular, if you were here for the pre-Octane and Octane like the post-Octane world of writing Ember code, I think for those of you who have been through that, I think that's like a great place to look back, to remember how it felt like before and after Octane. And I think that it would be a pretty similar comparison here because that's like what an addition is. I think the first time we did it, nobody had any idea, including us we were, like what exactly is the idea of an addition? But I think now that we have lived through that transition, I think it's kind of a stark, right? You look back to it, it's like, oh now before we used to have this book Ember Object Model and then now when you look at it, for the most part, it just looks like normal JavaScript. You don't have computed with a bunch of dependent keys, you just have normal classes with fields and sometimes getters and stuff. And I think at least for me, that's like the main thing that I remember from Octane to the point that now occasionally if I go back to an older Ember app with the older EDMs, sometimes work on the Ember Inspector, for example, I think we don't necessarily like we haven't reported everything to Octane yet. So sometimes when I go back and do that, I was like, wow, it takes me a while to remember how things used to be. There were very good reasons why they were that way in the past. I'm also glad that the landscape has evolved to a point where we don't need those things anymore. So at least emotionally, that's how I remember the Octane transition. And so the way that I think about Polaris is like there are a couple of related things but the thing that I focus on in my part of the talk is aligning Ember with the modern NPM package ecosystem. The way I think about it, the way I envision it, or the way I imagine it is like the way that you look at Ember code before and after Octane and you look at all the Object Model stuff and see how after Octane there's not a lot to talk about because it just makes sense, right? And I think that's the way I think about Polaris in relation to packages, imports, that kind of stuff, right. I think we built this pretty elaborate system because we're early enough to have to build the tools that didn't exist back then. And I think the overall ecosystem have kind of evolved to the point similar to how the JavaScript language have evolved back in the Octane timeframe to the point where we don't need a lot of those custom things anymore. And so the Polaris project in that specific compartment of aligning Ember with modern NPM packaging ecosystem is basically like how can we align the things that we are like that everyone else needs to do that and we're doing, but maybe we're doing it slightly differently such that you can't just use a lot of the other tools that other people get to use I think one example of it, it would be things like JavaScript and stuff. It's kind of like it almost works in the same way that even before Octane you could use native classes, it's still JavaScript. You could write that. But then if you try to do that, then you find edge cases where like the seams joins together, things start to fall apart a little bit or things become awkward. I think we're kind of in the same state in relation to the NPM ecosystem packaging tooling, that kind of stuff. You can kind of use TypeScript, you can kind of use like Webpack or whatever if you jump through a lot of hoops. But at the end of the day, I think they're just like a little tiny differences that adds up such that tools like JavaScript don't automatically just understand. What's up within Ember app at least one of the things for Polaris is to figure out how we can transition to a world where we don't have those little tiny differences anymore. So that when you open a project in VS Code TypeScript just knows what's up. Like when you use third-party tools like Skypack or whatever, fancy tools that understand packages and modules in the JavaScript ecosystem it would also just understand Ember code because Ember code in Polaris is also just like modules and packages in the same way that any other JavaScript code bases are. So I think that's like the big thing. That's like one of the big things for me. And that's what I focus on in my talk. I think before my talk laid out the landscape, I think there are three important pillars to the Polaris plan. One of the pillars is what I just talked about. The other two is continue to invest in or innovate in our reactivity system. That's number two. And the other thing is encourage adopting universal design principles in way that relates to accessibility. So we can talk about all of those, but that's the big, big picture.

**Robbie Wagner:** [16:13]

Okay.

**Chuck Carpenter:** [16:13] Okay. So in a way, would that mean changing things to a degree to where you wouldn't necessarily have to create an Ember addon to utilize a package? You could consume things more directly?

**Godfrey Chan:** [16:26] Yes, that's definitely one very important part of it, I think to an extent, right? Like you can already do that in Octane. With ember-auto-import, it was kind of a last-minute thing that we threw into Octane because it was ready, and why not? So Ed worked on this shim called ember-auto-import that you can drop into your app and then with that you can more or less just NPM install stuff from NPM, right? And then you can import them in your Ember app. I went into a lot more details in my talk, but that kind of worked. It's basically a very elaborate hack. Right? And I think that's great that we kind of got 90% there. But as I was saying earlier, because there's that 10% difference, a lot of tools don't just work with Ember. Right? And I think Polaris, we try to get like, let's get 100% there and actually make it how it works under the hood. I think with ember-auto-import, it's basically, well, we have this existing system, so let's try to bridge it so that you can install stuff from NPM, and then it will auto-import it into the existing system using app.import and whatnot, right? And I think with Polaris it's like, why do we still need that? We don't need that kind of stuff anymore, right? So let's try to get rid of that. Obviously, we can't just delete the code because things would stop working, right? I think the project is basically how can we go from point A to point B with a good transition path with good tools, good guidance, that kind of stuff. I think that's another place where we can try to reach back into the memory for Octane and things like with Octane, we have like code mods and like blog post guides and stuff like that help people move from the Ember Object Model to native JavaScript classes. And I think that's like a big part of why an addition is important. And I think we'll try to replicate, we'll learn from the mistakes from there, but also try to replicate the good parts, the successes from the Octane transition. Right.

**Robbie Wagner:** [18:42] So will Polaris then require things like addons to be V2?

**Godfrey Chan:** [18:48] Certainly. I don't know about required, but I think in the sense that when you talk about Octane, you think native class syntax, right? I think it's at least that degree of couple -- to an extent. Yes. I think that's what Polaris means right now. Additions are never breaking changes. Like they're not major versions like Ember four-point whatever will still work with V1 add-ons in the same way today. You can still use the classic Ember Object Model. But I think the point of the addition is to have a way to talk about what are the new idioms, what are the baseline expectations when you generate a new app, like when you start a new app today, or when you start a new addon today, or if you have an app that has migrated to Polaris, I think the expectations are like, oh, you'll get a lot more benefits from V2 addons. I think that's certainly a big part of the story. But that being said, there are compatibility layers there's Embroider, it will automatically translate addons for you under hood. So I think a lot of things will like a lot of the old stuff will still work. It's just that the more add-ons you have in V2, the more of the benefits, like the faster builds and stuff that you'll get from it.

**Chuck Carpenter:** [20:10] Got you. Obviously, Embroider is powering a lot of that and then that is Webpack based. Are there plans then as things evolve to be more just normal JavaScript, quote on quote, to be able to switch out, build tools like use Vite or whatever?

**Godfrey Chan:** [20:30] Yeah, definitely. I think that's the plan and that's the architecture. Right. What we mean by have Ember be more like regular JavaScript, I think we can be quite concrete about that. So I think one of the problems you have with Ember today in that area is it's pretty hard for a tool to understand where things came from because a lot of the parts in your app are just kind of implicitly glued together with the Ember conventions. Part of learning Ember is to learn that if you have a component that goes into this directory, and we kind of expect the directory to have this stuff in here, like maybe like a JS file with a HPS file next to it, and that means they're together, they're related. Or if you have a route, it goes into route folder. And then in the template when you have angle bracket, capital, Foo means invoking a component and you go find it in app/components/Foo.JS, something like that. Right. I think you can have an opinion on whether that's actually good or bad, but from a day-to-day programming perspective or from a learning Ember perspective, right. I think some people like the conventions, some people find it a little bit too magical. But nevertheless, I think tools have a lot of like there's just no way for the tools to understand that. Well, there is a way, but you have to teach all of those rules to the tool, really. And that's basically what Embroider is. So the problem is with Embroider, we can get that to work in the build by encoding those conventions and rules in a program, basically. But then still, if you're interested in using TypeScript or even just using the VC Code jump to definition or whatever, that thing doesn't know it. Right. So I think by making Ember more aligned with the modern JavaScript package ecosystem, what would it mean? The way that the ecosystem decided to express those kind of dependencies is to use imports. So let's find ways to actually encode those relationships with actual JavaScript imports. And with that, then the tools like TypeScript or VS Code can just understand those relationships without having to teach it to them. So that's like kind of general architecture or that's a general goal post, I guess, of like where we want things to be at. Embroider exists underneath that to basically bridge the gaps where that is not 100% true. I think there is a world where literally everything that we do is expressed using standard Java concepts, using imports, and stuff, but I think we're not going to get there in one giant step. So Embroider is there to basically insert those hidden imports, insert those two group files together, that kind of stuff. And I think the architecture, that's basically what it does when you should have an import, but you didn't have one because conventions or whatever, it will under the hood transform the file so that it actually insert the import there. So that it can then just hand that to Webpack or something else. So in terms of the architecture, yes, you can definitely swap out Webpack with Vite or whatever else that you want to use there. I think I'm not super familiar with the Embroider code base, but my understanding is pretty set up for that. Someone did a proof of concept PR for having a Vite backend instead of Webpack plugin. I don't know that when we ship, like, how many adapters we will have included, but in terms of the architecture, I think that's definitely something that you can do.

**Robbie Wagner:** [24:40] Okay, that's cool. Yeah, I wasn't aware of that. I thought it was kind of more just Webpack Magic, but that's good to hear that it's planning a little bit ahead and being agnostic there. So let's take a step back. We can talk a little bit more about Polaris. Maybe in a minute, but I skipped the question of how did you get into Ember? What brought you here and how did you get with Tilde?

**Godfrey Chan:** [25:04] That's a good question. Chronologically basically I spoke at EmberConf and at EmberConf I had the chance to talk to Tom at the time and Yehuda about my talk but also just, in general, I think in conferences you meet people and you chat about things and then a couple of months after that it turns out that they were also hiring so they reached out to see if I would be interested and the rest is history. So yeah, in terms of getting into Ember, basically I started doing Ember before I worked at Tilde but mostly as a developer capacity. I write Ember apps, I try to convince my workplace to use Ember app to use Ember with mixed success at a hobbyist level. I kind of like I run a small local meet-up in Vancouver at the time and I have a couple of Ember apps and I had some ideas and submitted a talk for EmberConf so that's like my involvement before Tilde and then after Tilde, it turns out as soon as I joined, like as soon as I started working here I was supposed to be doing something else in the company. But at the time the time I worked out that Thomas in the middle of moving to New York, Tom and Yehuda well Tilde has a project with LinkedIn at the time and Yehuda needed someone to pair with on that and Tom is not available anymore because he's like leaving company, moved to New York. I kind of just got thrown into the deep end on day one when I started like, hey actually you want to pair with Yehuda on Ember stuff? That's basically how I got started with Ember. Before that I was working, I think I mentioned that a little bit. I worked on Rails and stuff so I met the people who worked at Tilde at the time including Tom and Yehuda at RailsConf. Prior to that, we had some chances to kind of like we met them a couple of times, and then we kind of casually talked about stuff like Rails, Ember. So I think that's kind of like leading the little encounters a long way and then eventually I think EmberConf was probably when I really met them and the timing just worked out better at that time.

**Chuck Carpenter:** [27:29] Got you. Speaking of Yehuda, tell us what StarBeam is.

**Godfrey Chan:** [27:34] Right. Starbeam is Yehuda's project in collaboration with some other people in LinkedIn and elsewhere. So I was saying there are three pillars of Polaris so to speak. Really? The first one is aligning Ember with the modern NPM packaging your system, which we talk about a bunch. The other two is continue to invest in our reactivity system and universal design. Really so Starbeam kind of fits into the second point. It's not strictly related to Polaris in that we can totally ship Polaris without Star beam and I don't think you started Starbeam with Polaris in mined per se. I think it's just one idea that he had like a side project that he started working on that eventually got a little more serious. But the short answer is it's basically tracked properties and tracked built-in Ember but ported to work with other frameworks. So that's like a very general way to talk about it. But I think it's the same reactivity model that we are now very used to and kind of take for granted in Ember, right, where you have add tracked in a couple of places, and then everything else kind of works like falls on that. You can have getters that depend on those tracked states or you can use them in template and everything kind of just automatically figures out what the dependencies are and update itself as needed. So it's basically extracting that part into a dedicated data like Reactivity library that you can use in React, you can use in VUV Ember, whatever. And I think one of the benefits of that is you can now write like if you wanted to, you could write the kind of libraries like Apollo or Ember data in a framework-agnostic way or at least have a way to work in all the frameworks because it just pulled out the data modeling the reactivity layer and just have a thin layer of glue that glues it back into each of the frameworks. At least that's the theory. So I think from an Ember user's perspective, it might not actually be particularly mind-blowing or impressive or might not even appear that useful at first glance because it's just basically how you expect things to work in Ember. But I think there are benefits too in the sense that a lot of companies have apps in different frameworks for one reason or another. For example, I might not be very up to date on this, but I think the main Intercom app is an Ember app. But then it has always been the case that their chat widget that you put in other people's website is written in something else. I think last I heard that was written in React. I don't know if that has changed but then now let's say you're in that situation where you have a mix of Ember and React code. Now you have a way to maybe create more abstractions or libraries that are shared between apps that would work in both. A lot of the things that you want to share actually has nothing to do with rendering per se. If you do render the data on the screen, you want them to be up to date, but then other than that, in itself it's kind of like just regular classes or arrays or data stores and stuff. So yeah, Starbeams' is basically an extraction of that pattern into its own library. And I think in the very long term maybe we can expect the related reactivity system and Ember to be implemented on top or in terms of Starbeams. I think that's like a longer-term goal. In the short term, it can interrupt between the frameworks and it will probably be a tagged-on thing in Ember. In the long term, there's no reason we need both tracked properties and Starbeam because they're like actually just the same thing. Right. Like Starbeam is like track properties V2, like plus track built-in and stuff. Right. So I think in the long term add track would probably be in re-export from Starbeam and I don't know, in the Polaris time frame or whatever. Right. But yeah, it's basically the same concept that we're already used to. I think the main reason we're talking about it is because you could is giving a talk on Starbeam at JSNation, I think on this coming Monday. I don't know if people need tickets and stuff, but I think over the next week or two, eventually, you'll find a talk.

**Chuck Carpenter:** [32:30] Is that the one in DC. I forget.

**Godfrey Chan:** [32:32] I'm not sure. I can check. The conference is called JSNation. I think they're a hybrid conference this year. So in a sense...

**Chuck Carpenter:** [32:42] Kind of anywhere.

**Godfrey Chan:** [32:43] Yeah, it could be anywhere. As far as where the in-person part, I have no idea.

**Chuck Carpenter:** [32:49] So let me regress a little bit on what you're speaking about to me because I haven't used Octane or anything recently, most of my Ember experiences from previous years. But it sounds to me like it would be an abstraction layer that would allow you to stitch things together in a Micro Frontends kind of way, where you could have a shared state across Micro Frontend apps and then think of ways like Ember knows how to consume it. This could be a shared thing and you could write away in your app to do that.

**Godfrey Chan:** [33:24] Yeah, I think that's certainly one way you might want to use it. Right. I think at the most fundamental level, the go-to example or the basic example you will see in every framework's guide or whatever is like you have a person object. Like I know you have a first name, last name, and you want to make sure you want it rendered out on the screen, but you also want to make sure if that person's first name and last name get updated without you having to do any imperative thing. It just does reflect that on the screen.

**Chuck Carpenter:** [33:59] Right, right.

**Godfrey Chan:** [33:59] So I think it's basically a framework-agnostic way or at least a way to express that kind of reactivity that has adapters and like the major frameworks. Right.

**Chuck Carpenter:** [34:13] I could see this as in a way, Robbie, where you may never have to write a hook even if you had to work in React.

**Robbie Wagner:** [34:18] That's what I was going to say. Yeah, I could go to React or anything that might render web components, let's say so that then I could use those everywhere and use this in it to do the same tracked stuff I'm used to. And yeah, I won't ever have to do functional useEffect or useState or any of that.

**Godfrey Chan:** [34:38] Right? Yeah, I think that's an observation. It's like, for one reason or another, it tends to be the case that you don't just work in Ember. Right. But I think we also really appreciate and realize that the programming model that we have in Octane with tracked properties is pretty powerful right. Where you just annotate where the roots of the mutable, like where the mutable stuff are, and then as long as you annotate that, then you can just use it anywhere else and it will track the dependencies all the way up back to the roots, so that when the root changes, it knows what to invalidate. And I think the idea is basically to extract that and then make it less coupled to Ember. And I think you mentioned React, and I think that's great because I think his demo is actually in React. It's kind of weird, but that's kind of the point of what this is, really. So if you manage to find Yehuda's talk next week or whenever it comes out yeah, I think give that a watch. It's a demo of how you use Starbeams in React. And I think that's pretty relevant to what you were saying.

**Chuck Carpenter:** [35:48] Yeah, I think he's casting a very wide net with that and bringing familiar concepts to a wider audience. Like, okay, if you don't want to use this thing, but there's a part of this thing that could be very useful to you. Let me show you how that is. Right, so I was thinking a little bit earlier, because you're talking about like, coming from the Rails community, and a lot of people were led to Ember through that, the Active Record paradigms that are drawn over from that and people understand and all that kind of stuff. And I was like, way early on, we actually interviewed Tom Preston Warner who came from Rails, and somehow through GitHub, he just completely skipped the Ember thing. And it's like, oh, I heard of it once, but I got into React and I really liked that for a while. So he has that full-stack framework now, RedwoodJS, which I think also draws from a lot of the paradigms that were popular in Rails. I'm wondering, have you heard of looked into that at all?

**Godfrey Chan:** [36:50] I'm sure I saw the announcement on Hacker News or whatever, but I personally have not really kept up with that lineage of frameworks. I don't know if that's actually short answer. No, not really. I've probably seen the announcement come up. I don't know a whole lot about it.

**Chuck Carpenter:** [37:11] It seems like that this Starbeam could be like tailormade because as of right now, their view layer is only React. They want to talk about letting you be more flexible in it. But let's say you like a lot of things about the opinionated full-stack startup framework that it is, but then you're like, I want to deal with state in a way that isn't Redux-based or isn't just hooks throughout or something else. Oh, here we go. Maybe there's a good fit there. I just think it sounds interesting.

**Godfrey Chan:** [37:41] Right. Yeah, definitely. I think we'll see what the adoption is like. Right. But I think conceptually a reactivity layer that is decoupled from the framework makes a lot of sense to me because there's just a lot of libraries and abstractions that you want to write that eventually, you want people to be able to use them in UI. A lot of talk about reactivity, but usually that boils down to you want to put it on the screen and want to make sure it's kept up to date. Right. Maybe you're working on the equivalent of Google Maps or whatever, where you just have a lot of data objects and you don't need to have like maybe Google Maps is not the best example because probably the rendering is pretty coupled to that, but maybe you're serving you're writing something that wraps an API. Maybe it's like the OpenStreetMap API work gives you the relationship between the streets and the cities or buildings or whatever. And at the end of the day, you expect people to want to render them on the screen, maybe on a map, maybe on a 3D thing. Like, who knows, right. So you don't really want to, in your library, be hard coupled to react or whatever. I think we're kind of past that as a community ecosystem. But then what does that mean? You have to have some way to let people wire it up. And I think the current status quo for anything is like, hey, maybe you have some callbacks or something, and then you have to do a lot of elaborate things to wire it up, and it just end up that people have to write framework-specific wrappers for a library anyway, which is like one of the things that we sell. Maybe it's nice that you don't have to do that anymore. Right. So I think having something like Starbeam where you can express those reactivity concepts or those annotations without making your library only usable in React or Vue whatever is like a good thing to have in 2022.

**Robbie Wagner:** [39:47] Yeah, for sure. So let's transition to somewhat not here. We talked about a lot of Ember and some star beam. Oh, you have a question, Chuck?

**Chuck Carpenter:** [39:55] Yeah, I do want to transition, but I want to control the transition by telling a joke because we were talking about before we jumped to the podcast how I guess, Godfrey, you are known for having humor in your talks, so I thought I'd just kick you off with a joke that I enjoyed that I read today.

**Godfrey Chan:** [40:14] Yes, please.

**Chuck Carpenter:** [40:15] What's the difference between a tuna, a piano, and a pot of glue?

**Godfrey Chan:** [40:20] I don't know, tell me about it.

**Chuck Carpenter:** [40:22] You can tune a piano, but you can't piano a tuna.

**Godfrey Chan:** [40:29] Nice work.

**Chuck Carpenter:** [40:30] There you go. So, yeah, we are going to transition.

**Robbie Wagner:** [40:36] So yeah, I mean, when you're not coding, obviously you're not out drinking. So what hobbies do you have? What do you like to do?

**Godfrey Chan:** [40:45] Right, well, I probably watch too much YouTube, not the conspiracy theorist section of YouTube, but I think especially during COVID, my brain decided to get a lot of enjoyment seeing people do things that are interesting rather than doing those interesting things myself, I watch a lot of random cooking stuff and then you see people I'm sure I became a better cook from watching cooking stuff, but also for the most part, I just like watching people who are good at those things, like explaining, teaching other people's stuff or just like being enthusiastic about whatever that they're doing and feed off that energy a little bit. I watch a lot of cooking stuff, like a lot of the maker stuff, like the people building things, even though I don't think I'll ever get into a place where I have a CNC machine in the garage or whatever. But nevertheless, I like to watch people who are in that position and talk a lot about the details about their CNC stuff and whatnot. Recently watched a lot of videos, tutorials about different kinds of programming, orchestral programming, and mostly just playing virtual instruments in a computer, but with virtual orchestra, basically, you can do a lot of the arrangement, but there's also a lot of different techniques that you do to make it sound plausible or sound real. I have been doing a little bit of all of those things myself too, but I don't think that I do enough of it or approach it seriously enough to call any of that a hobby. I guess my recent hobby is watching people who are really excited about their hobbies and feed off from that energy a little bit.

**Chuck Carpenter:** [42:45] Yeah, I can understand that a little bit. I've gone down a few rabbit holes with some of the First We Feast shows. I've spoken a few times on here about Hot Ones, which I love that it's so entertaining. It's not cooking, but it's doing interviews with celebrities, but also like pushing them a little bit with spicy wings. There's another one on there called The Burger Show and I'm a big fan of burgers. It's one of my favorite foods. And there's a whole series. There where he'll go try different famous burgers and a few episodes they just try to recreate some burgers. Like they do the Inn Out Burger and Shake Shack burger and do kind of a home compare and contrast. That was cool. So yeah, I don't know. That's not really culinary delights, but...

**Godfrey Chan:** [43:32] I could be like eating that burger now or I can be like watching those people eating that burger and having a really good time and like for some reason that's entertaining.

**Chuck Carpenter:** [43:42] Yes. Vicariously living through some of the stuff they do, I love. And it's kind of like on a small, narrowly connecting premise to this show. It's like taking people, giving them some whiskey or whatever, and also talking about their lives outside of whatever technical things that they're working on. And I feel like Hot Ones is a little bit like that. It's like, yeah, we're going to talk about the thing you're promoting or whatever right now, but also we're going to ask you some random questions, especially the hotter things get. And they do a really good research on people and so they'll ask him like normal questions about something other than, oh, Dave Grohl on there and they ask him things other than music-related. And I think that's really interesting.

**Robbie Wagner:** [44:27] Yeah, I think a lot of people kind of got into living vicariously through whatever. Pick your poison. Like a lot of people watch a lot of 90 Day Fiancé or just things where people are like, living life kind of whatever. Obviously, that's a more extreme example, but anything where other people are getting into real-life drama or cooking or real-life things, you just watch that instead of experiencing the real one because you're stuck at home, right?

**Godfrey Chan:** [44:56] Yeah, it's kind of weird. I think being stuck at home is definitely one part of it. But also just I don't know, sometimes I watch people play games and stuff, like playing games myself. I have that game. Like I could play it, but then I don't know.

**Chuck Carpenter:** [45:14] Maybe this person is better at that game and I want to see what happens without having t, yeah.

**Godfrey Chan:** [45:18] It's interesting to see, especially if we're kind of like to play games like Cities: Skylines, for example. I don't know that I actually like playing it that much, but I really like watching people play Cities: Skylines or that kind of game. Just like put a lot of thought into how they want to build these virtual cities or whatever. And then I enjoy people talking about the thought process and how they approach things or that just seems like so when you look at the end result, like, wow, I don't think I could have done that myself. But watching them spend a condensed version of I'm sure they put like 10 hours or whatever into it, but added it down into 40 minutes, things. Like, for some reason, some people watch a lot of drama and stuff. I think for whatever reason, my brain decided actually I get a lot more enjoyment out of watching these kind of stuff than watching shows.

**Robbie Wagner:** [46:16] You like when people create things regardless of the type of thing, right?

**Godfrey Chan:** [46:22] There's something about when people are creating things and they're passionate about it and they're knowledgeable about it being just like sitting in the room watching them do the thing. I think I feed off that energy. I find that cool.

**Chuck Carpenter:** [46:39] I understand that I actually like those regular people way more than normal reality shows. Like you said, my wife watches a bunch of 90-day Fiancé and some other just, like, totally random things, but it's just so over the top and not believable. And YouTube shows, like, obviously the barrier to entry is low. They don't need to make any money off of it so that you can just be like, I like this thing, and here I am showing people. Production value goes up. Sure, but it's nowhere near some of these crazy reality shows, so I don't really even consider them the same. And yeah, it's just fun to see that. Oh, what's someone else doing? Like you said, oh, I have this game. Haven't had time to play it, really. But if I watch this for 40 minutes, I can kind of see what's going on and I still get some enjoyment out of it.

**Godfrey Chan:** [47:23] Right?

**Robbie Wagner:** [47:23] Yeah. My wife will watch like, an entire playthrough of a game, like Uncharted, for example. A game like that, because there's like, a story, right? So you watch a person play from beginning to end, you get the whole story. It's like watching a movie. People are into that.

**Godfrey Chan:** [47:37] It's weird, but I do that sometimes.

**Chuck Carpenter:** [47:40] I heard Twitch does pretty decently, so.

**Robbie Wagner:** [47:43] Yeah, they have a little bit of money, I think.

**Chuck Carpenter:** [47:44] I think they're doing all right. So someday they'll be as good as Ship Shape in terms of revenue. Our six employees were up on there. How many employees does Tilde have?

**Godfrey Chan:** [47:56] Yeah, I think six. Hopefully, no one from my company watches that. Like, wait a minute.

**Chuck Carpenter:** [48:03] I think he forgot.

**Chuck Carpenter:** [48:04] But who? You didn't do names. That was smart. You didn't say names and then forget a name because I probably would have said, like, I don't know, and then Robbie's like, you forgot me.

**Godfrey Chan:** [48:17] Yeah. So I guess we're actually the same size, like, right now. Yeah, small company.

**Chuck Carpenter:** [48:25] Small company, big reach.

**Robbie Wagner:** [48:26] Makes something's easier. It's hard when someone wants, like, ten developers for something, though. Can't really do that.

**Godfrey Chan:** [48:34] Yeah, small company struggles. But I think at the same time you also like, if you want to do a podcast, you get to do a podcast. So there's something nice about that. I think we're fortunate to be in a position where we can choose to stay small. And sometimes we work on things like Ember, and that's cool and that's why our company exists and that's so far. Enjoying that.

**Robbie Wagner:** [49:02] Yeah, for sure.

**Chuck Carpenter:** [49:03] How many years would that be now? I was trying to think earlier when you were talking about timeline of like, oh, met Yehuda and Tom, and then Tom was moving.

**Godfrey Chan:** [49:12] Yeah. I think this summer would be my 7th year here, I believe.

**Chuck Carpenter:** [49:19] Solid.

**Godfrey Chan:** [49:20] Yeah, kind of wild.

**Chuck Carpenter:** [49:22] Respect. Cheers you.

**Godfrey Chan:** [49:24] Yeah, I'm sure too, one or two generations back, like, seven years is like nothing. But for me, I don't think I imagined myself, like, staying at a place for seven years before until now, here I am.

**Chuck Carpenter:** [49:39] And I would say in the modern development paradigm, a developer career paradigm, I mean, two, three years is like, I've been here a while, I better go.

**Godfrey Chan:** [49:49] Right?

**Chuck Carpenter:** [49:49] And in order to make those jumps incentivize in that way, especially if you're in the big corporate ladder thing, which you kind of have to do, or what you can do, or you get lured away by, well, if I go here, I'm going to get a big jump because I don't have to go through your steps, maybe, I don't know.

**Robbie Wagner:** [50:09] Yeah, that's definitely what I did for the entire beginning of my career. I was like, let me just work here a couple of minutes. Go somewhere else where I make a bunch more money. Yeah, it's way worse now though. Like, the job market is insane right now.

**Chuck Carpenter:** [50:24] Yeah, the jumps weren't so significant back in the day when I was making those changes and kind of wasn't like that. I'd be like, yeah, I could change jobs and make five grand more a year, but I kind of like this job, so maybe I'll stay another year or so. And yeah, there weren't the incentives to sniff around unless you were just unhappy you weren't like, sniffing around because you're like, oh, I heard my friend is making 30 grand more than me. Maybe I could do that.

**Godfrey Chan:** [50:50] Yeah. So we're at time here before we end, anything else you would like to plug or any projects or things going on Godfrey?

**Robbie Wagner:** [50:59] Well, they're projects personally, but I don't think I have anything that's ready to share. I think I'll probably just point people to go watch Yehuda's talk when it comes out. Like, go check out Starbeams. I think for Polaris, hopefully, in the coming months, we will start spinning up a lot of GitHub discussions and stuff. So watch for that. In the meantime, a lot of that's happening in Discord, and I think there are occasional meetings and stuff. If people are interested, definitely find your way, ping me or ask around. We can get into the right rooms, like virtual ones and real ones. Yeah. And also I think Preston NVP has been working with Yehuda on Ember Resources. That is like I think Resources itself is kind of like related to Starbeams because it's like kind of like I think intrinsically Starbeams has some of the same ideas, but I think Resources is probably going to be a pretty integral part of Polaris in the reactivity department as well. So check that out. But yeah, I think I don't have anything to plug myself, but those are some of the things we talked about today.

**Chuck Carpenter:** [52:12] Just anything you care about.

**Robbie Wagner:** [52:13] Selfless plugs. None of your projects, everyone else's stuff.

**Godfrey Chan:** [52:17] Maybe next time I'm on here, I will have something by that. Those are like what I want to talk about.

**Chuck Carpenter:** [52:23] Sounds cool.

**Robbie Wagner:** [52:24] Cool.

**Chuck Carpenter:** [52:25] Yeah. Thanks again for being on. Thanks, everybody, for listening if you liked it, please subscribe. Leave us some ratings and reviews if you want. That'd be cool and we'll catch you next time.

**Chuck Carpenter:** [52:36] Thanks for listening to Whiskey Web and Whatnot this podcast is brought to. You Ship Shape and produced by Podcast Royale. If you liked this episode, consider sharing it with a friend or two and leave us a rating, maybe a review, as long as it's good.

**Robbie Wagner:** [52:51] You can subscribe to future episodes on Apple, Spotify, or wherever you get your podcasts. For more info about Ship Shape, and the show, check out our website at shipshape.io
