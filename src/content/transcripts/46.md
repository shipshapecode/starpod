**Robbie Wagner:** [00:09] What's going on, everybody? Welcome to another Whiskey Web and Whatnot with myself, Robert William Wagner, and my co-host, Chuck Carpenter.

**Chuck Carpenter:** [00:18] Whoa.

**Robbie Wagner:** [00:19] Or as you may know him.

**Chuck Carpenter:** [00:20] Yes.

**Chuck Carpenter:** [00:21] Charles William Carpenter III.

**Chuck Carpenter:** [00:22] As no one else calls me other than yourself and the bank. So our guest is appropriate.

**Robbie Wagner:** [00:29] Yeah, the bank includes "III" even.

**Chuck Carpenter:** [00:31] Yeah. All official documents. It's better to include more than less to differentiate between well, the other two, for starters.

**Robbie Wagner:** [00:39] Fair. Yeah. Anyway, I have things I can say about that, but we won't go down that. Our guest today is Mark Steadman. How's it going, Mark?

**Mark Steadman:** [00:47] Good. How are you all?

**Robbie Wagner:** [00:48] Doing well.

**Chuck Carpenter:** [00:49] Superb.

**Mark Steadman:** [00:50] Fantastic.

**Robbie Wagner:** [00:52] I guess I messed up the intro. I was probably supposed to start with this is A11Y hour, but.

**Chuck Carpenter:** [00:59] We're getting used to it.

**Robbie Wagner:** [01:00] Whatever. This is an accessibility episode. Mark does accessibility stuff. Mark, do you want to tell people more about what you do, who you are, and what you do?

**Mark Steadman:** [01:09] Yeah, absolutely. So, again, just reiterating Mark Steadman. I'm a principal accessibility engineer at Fidelity Investments. I've been in the accessibility field for close to about like eight years now, which if you ask any of the other folks that are in the accessibility field, I'm a youngin in the accessibility field, which is totally fine. I will wear that badge of honor with that. But I work specifically in my role to help build up an accessibility program within Fidelity Investments. I'm currently focusing on mobile, actually, a little bit of a career change for me, one that which is super dope, but in my past, I focused more specifically on JavaScript Framework accessibility, automated solutions for accessibility, and then also developer-specific accessibility. So my biggest passion is I feel like there's a gap in the field right now where developers are kind of not being reached out to from accessibility side of things. So my passion both in my job and actually on the side, too, so I like to write for accessibility as well, is to kind of fill that gap. Right. Where I'm a dev. I was a dev. I was that dev who wrote code and threw stuff out there in production, went home to my wife and said, look, I made that and not know the impact of what I made. Right. And so my goal is to kind of reach out to developers in a different sense and tell them, hey, I've been in your shoes. I've been that person who made content that was inaccessible. Right. So I do it through a bunch of different avenues, writing on the side. My current job advocating for automation, making sure that JavaScript Framework accessibility is out there and known. So I do a little bit differently than other folks in the accessibility field because it's ever-changing. Right. Development, especially in the website, is something that literally changes. Probably, as we're talking right now, something probably changed. So, yeah, it's just a quick introduction for me.

**Robbie Wagner:** [02:48] Yeah, cool. Yeah, we'll get a lot more into that later. But as always, Chuck gets really cranky if we don't do the whiskey first. So we'll get into that.

**Chuck Carpenter:** [02:58] Well, I mean, it's 2 o'clock here where I'm at, and you know that's drink o'clock.

**Robbie Wagner:** [03:03] Been waiting all day.

**Chuck Carpenter:** [03:05] I've been waiting since this morning. I've been waiting since breakfast. I had one then.

**Mark Steadman:** [03:11] Absolutely.

**Chuck Carpenter:** [03:12] All right. So today, we're having the Angel's Envy, which is a port-finished, port wine-finished Kentucky straight bourbon whiskey. It is 86.6 proof mash bill of 72% corn. That's a lot. 18% rye, 10% malted barley, and aged for approximately six years lended in small batches of eight to twelve barrels. My guess is that probably some of it has to do with because they probably don't finish it for more than six months, give or take.

**Robbie Wagner:** [03:44] Yeah. The finishing, I think, had said six months. And it's finished in the port wine barrels, which are made of French oak, apparently.

**Chuck Carpenter:** [03:52] Yes.

**Robbie Wagner:** [03:52] And this one was a gift from my in-laws, so thanks, Kevin and Jen. If you listen to this ever, I figured I should mention that.

**Robbie Wagner:** [04:01] I saw this in the notes where it said gift from my in-laws. And I didn't know if that was Mark. Like, Mark was like, I've got this. I've been waiting to open it.

**Mark Steadman:** [04:09] No. The only thing I do differently, everybody else, I told this to you all for ship shape, my secret. So anytime I present, I have an accessibly mug. So it literally just has an alley mug that's on there. It doesn't matter which one consistently, but anytime I presented in person or anything like that, I always have just one little shot of whiskey. Smallest one, just to calm my nerves one time. But I was talking to you all about it. You got to have it when you talk in person. But when you talk virtually, you also have to because you're constantly thinking, do I have the audience? Do I have the audience? Like, am I doing good stuff? Right? So I always took the mug, and it just stuck with me. I don't even have whiskey glasses anymore. My wife would be like, you drinking coffee? I'm like, nope.

**Chuck Carpenter:** [04:44] Nope, just constantly whiskey. Yeah, that's interesting. And you've given away your trade secret, though.

**Mark Steadman:** [04:50] I know.

**Chuck Carpenter:** [04:50] Take the edge off.

**Mark Steadman:** [04:51] I know. Now I won't be invited to speak anywhere so.

**Chuck Carpenter:** [04:55] Or you'll be invited more to speak. They're like, yes, this guy's life of the party.

**Mark Steadman:** [05:00] Yeah, look out in the crowd. Hopefully, we get back to in person. Everybody will have coffee, mugs. I'll be like, oh, yeah, I know what's in there. Let's go. All right.

**Chuck Carpenter:** [05:06] I will definitely do that.

**Robbie Wagner:** [05:08] On the nose of this one, I'm getting.

**Mark Steadman:** [05:10] I like this one.

**Robbie Wagner:** [05:10] Almond extract.

**Chuck Carpenter:** [05:12] You just influenced me. I was going to say vanilla, actually, but it might be.

**Robbie Wagner:** [05:17] A little vanilla, too.

**Mark Steadman:** [05:18] That's where I was going to go.

**Robbie Wagner:** [05:19] Yeah, maybe a little bit of citrus, some lemon, or something.

**Chuck Carpenter:** [05:23] I am getting kind of almost like a creme brulee, like the top, little charred sugary top when I drink it.

**Robbie Wagner:** [05:31] That's the port barrels.

**Chuck Carpenter:** [05:34] Port is a little sweeter.

**Mark Steadman:** [05:35] I was going to say vanilla beans. I do taste vanilla in it. This is really good. This is really, really good.

**Chuck Carpenter:** [05:40] Yeah. Tastes like fresh cut grass, aluminum foil. I like to put arbitrary descriptors in there, so they throw off. I've only got like a handful of actual ones that apply, but yeah, I could say either a bit of dolce de leche creme brulee. Like the crusty sugar top.

**Robbie Wagner:** [06:03] Yeah, there's a little bit of toastiness to it. I could say like a toasted marshmallow or something as well. Would be any of those, like, crystallized burn sugar kind of taste is getting a little bit of that, for sure.

**Chuck Carpenter:** [06:15] Yeah, it's interesting. Yeah, I could dig it. Yeah, it's got a little of that finishing flavor, but it's good. I haven't had an Angel's Envy in a while. And I had a friend back some years ago that had one that was like, I want to say like a ten year, and had some other fancy stuff with it, and it was like $180 bottle. And I was like, well, I'm glad I'm trying yours. Yeah, I know. I was like, It's good, but I don't know, when you start to approach those things, it better be like, you've blown my doors off. This is amazing. And I'm not sure it applied there, but their regular offering here, I have to say, like, yeah, this is a nice regular sipper. It's got a tinge of burn. Nothing too crazy, easy to have straight up. So I'll just go first in the tentacle scale.

**Robbie Wagner:** [07:01] Do it.

**Chuck Carpenter:** [07:01] One to eight. We started segregating by whiskey type now. We used to like, lump them all together, but now it's getting to be like, a little much. So here we go. We've got a bourbon with a finish on it. I'm going to give it a solid six. Would have again, I think the price point is great. It was like 45 for me, so all things seem pretty good there.

**Robbie Wagner:** [07:21] Yeah, I think I would agree. I don't know, it's always hard for me to put my finger on exactly why I like something or not, but I think a six sounds about right. I would drink this any time.

**Chuck Carpenter:** [07:31] Later tonight?

**Robbie Wagner:** [07:32] No, I mean, I actually just kind of save all of these. I have a big stockpile of tons of whiskey just waiting to open a whiskey library, but uh.

**Mark Steadman:** [07:42] I feel like everybody has that, though. Like, if you work with people who are like, I'll send you whiskey. You end up being like, yeah, I'll sip that, I could drink that all the time. You end up with like 30 bottles, and you're like, wow, I don't even remember what I have. It's kind of where I got to my previous job is what we do. We used to send whiskey back and forth to each other. And then I ended up one winter, I was like, wow, I have like, 25 bottles of whiskey. I need to do something with this. Instead of just being like, I tried this newest crate, just leaving it be.

**Robbie Wagner:** [08:07] Yeah. It becomes a problem.

**Chuck Carpenter:** [08:09] I have a different kind of problem.

**Robbie Wagner:** [08:12] Where you have zero bottles of whiskey.

**Chuck Carpenter:** [08:14] I was like, oh, crap, I drank that one for next week's podcast. I better get a new one.

**Robbie Wagner:** [08:19] Yeah, it happens.

**Chuck Carpenter:** [08:21] I had family in town this weekend. They're interested. I'm from Kentucky, too, so they're very interested.

**Mark Steadman:** [08:28] Nice.

**Chuck Carpenter:** [08:28] Where are you located?

**Mark Steadman:** [08:30] You all can have a laugh at this. So I am in Illinois, but I am in the great metropolis of Normal, Illinois. Yes, Normal. N-o-r-m-a-l. I am as normal as they come. I'm a Normalite through and through. So if you need context. Bloomington-Normal is where State Farm Insurance headquarters is. That's where I first started my career is at State Farm. Yeah, State Farm. So if you grew up in Bloomington-Normal, somebody in your family probably worked at State Farm.

**Chuck Carpenter:** [08:54] Interesting.

**Mark Steadman:** [08:55] At some point in time. We do have the Rivian factory here now that makes the Rivian trucks.

**Chuck Carpenter:** [08:59] Oh, yeah.

**Mark Steadman:** [09:00] Electric cars, which is super dope. Yeah. So we get to see us driving around. It's actually super cool, price point-wise and stuff. There's a lot of people who worked here that got kind of like first access. Like, some of my neighbors have Rivian trucks. They're so cool. It's so cool to see those things driving around.

**Chuck Carpenter:** [09:12] I test drove one two weeks ago.

**Mark Steadman:** [09:13] Did you?

**Chuck Carpenter:** [09:14] Yeah, I'm on the list.

**Mark Steadman:** [09:15] Very cool.

**Chuck Carpenter:** [09:16] For like two years now.

**Mark Steadman:** [09:17] Awesome. They just got, like, the Amazon electric trucks done because they did a whole contract for Amazon. We're supposed to in town. They're supposed to go to Chicago or somewhere else. But because we're awesome in Normal, you know, they're supposed to send those and let those kind of go around town here. So I'll be interested to see those as well because it's really cool. Like, they have exploded in town to the point where we have people from all over the country here working. And like, the housing market here has been bonkers to find even a place to live for some people just because they've opened up, like, between 5-10k of jobs just for manufacturing plants. So it's pretty cool. It's actually an exciting time to be here. Exciting time to be in Normal, Illinois.

**Chuck Carpenter:** [09:54] Seems pretty normal to me.

**Robbie Wagner:** [09:55] It's not a normal time.

**Mark Steadman:** [09:57] Yeah.

**Chuck Carpenter:** [09:59] So many jokes be made there.

**Robbie Wagner:** [10:00] And we're just getting started, so let's circle back. You didn't do your tentacle rating. Mark?

**Mark Steadman:** [10:06] Yes.

**Robbie Wagner:** [10:06] How do you feel about this whiskey?

**Mark Steadman:** [10:07] I was actually going to agree. I was going to say actually, like about six of eight. I think this is really good. It's a really good sipper. I'm really picky about that because if there's some whiskies that hit and I'm like when I get done with it, it's got like a little bite afterwards, I'm like, yeah, I will come back to this is one that I could just sit and sip. This is really good. I really, really like this one.

**Chuck Carpenter:** [10:24] Yeah, cool.

**Mark Steadman:** [10:24] I say because there's, like, a scale, it's a good scale. If you get to eight out of eight, it gets dangerous. Like, I could drink all this really quickly. [unintelligible]. But like six out of eight's good.

**Chuck Carpenter:** [10:34] Yeah, I will only drink this is an eight. We've never had an eight so far.

**Mark Steadman:** [10:39] Are you sure?

**Chuck Carpenter:** [10:40] I'm pretty sure.

**Robbie Wagner:** [10:40] I thought the Old Forester was an eight.

**Chuck Carpenter:** [10:43] Well, I have to go back and listen to that one. We have to track this.

**Robbie Wagner:** [10:46] To capture all these in an app? Yeah.

**Chuck Carpenter:** [10:51] I'll go back and check on that because I don't recall it. I think I knew some sevens, but.

**Robbie Wagner:** [10:55] Yeah, I don't know.

**Chuck Carpenter:** [10:56] It makes me think of an old Friends episode. Seven, seven. Okay, we should move on.

**Robbie Wagner:** [11:02] Yes. You mentioned that many times as well, which I finally figured out the reference after many weeks of you mentioning it and me thinking about, when did this happen? I finally got it. But we'll let other people .

**Chuck Carpenter:** [11:15] Figure that out.

**Robbie Wagner:** [11:16] Think about it if they haven't gotten it yet.

**Chuck Carpenter:** [11:18] There's also the whole what is it like when something about Mary the seven-minute abs. Seven-minute abs, man. That's it. And they're like, what if someone invents six-minute apps? No, seven is the magic number. Anyway.

**Mark Steadman:** [11:31] Yeah.

**Robbie Wagner:** [11:32] Anyway, let's talk about accessibility.

**Chuck Carpenter:** [11:34] Let's talk about serious things. Yes, that's why we're here. Partially.

**Robbie Wagner:** [11:38] You gave a little bit of an intro into kind of what you're doing now and all that. Tell us about your journey there. Like, how did you get into web development in general? And were you always kind of accessibility-focused, or did you do a bunch of years of not doing that and then go down that path? Or how did you get here?

**Mark Steadman:** [11:55] Yeah, my story is actually not like I always say, everybody always like, when I say my story, they're like, that's so different than how everybody else got to it. It's really not. I always say this, accessibility has a moment of impact, and the moment of impact is when you're just like, oh, I finally see, like, okay, why does accessibility matter? Right? I have that, like, click of, like, wow, this is a whole new world introduced to myself. So how I got there when I was in college, this is kind of one of my fun facts to talk about later. I coached high school football as well. In the fall, been doing it for ten years. I wanted to get into business teacher education when I started with until I observed a high school class and was like, oh, my God, hell no, I can't do this every single day. So my next thing was I always wanted to do programming side. I wanted to teach to be more of, like, a teacher teaching web development and programming, like, in high school. It's still lacking across the country. So I wanted to do that, but I didn't. So what I did was I went in, got a degree in Business Information Systems in Computer Science minor. Jumped in, and right when I went to State Farm, I went to statefarm.com. I love this story because my teammate now, who is kind of our team lead for this, is the one who I'm going to mention here in the story. So I was passed within my first year of making this map module thing for statefarm.com. Lovely things. Search for agents, right? Search for it. You can see the pens on the apps. All lovely, right? So I make this. Do it record time, feel great about myself, and I send it over. And then, all of a sudden, I had these issues come back, and it won't go to production because I have accessibility issues. The hell are accessibility issues? I have 256 unique accessibility issues that's not repeated. So you're talking about in the thousands. And the person I work with now is the person who evaluated it. They were really good friends. He's the one who brought me over to Fidelity. He was like, yeah, this is that good. And basically, like, some of the other folks that are within State Farm's accessibility team were like, this is horrible. If I was a user using a screen reader or if I was user who was colorblind, right? If I was a user who was using a keyboard, I could not do anything with this, right? And it's just an agent locater, right? Map search, little agent details down below, underneath it. We thought we made it accessible. That's when it all flipped for me. So I sat with my teammate now, and a couple of other folks who were blind, low vision, sat with them. And that was my moment of impact. The moment that I saw someone use assistive technology, a screen reader, and actually use it and go through, like, all the stuff and all the pain that I was causing them for something that if you're looking at how an insurance company works, that's a major thing. I have to find my insurance agent, right? That's huge in the digital age. So I'm blocking somebody from being able to do a basic functionality of trying to find somebody, right? And so what I did was I sat with them, and that changed my perspective on everything. And ever since then, I kind of got into the accessibility. I was like, yeah, this is really cool. I didn't know that the Internet kind of was able to be used by people with disabilities. I didn't know that. And there's a lot of people that don't know that. If you look on blog posts, anything like that, people say somebody who is blind can use the Internet. Yeah, it may sound arrogant to somebody out there, but people don't know. They don't know if someone can use a screenreader to do that. So I didn't. I was in the same boat. I was that person. I was an arrogant person that learned from my own mistakes. If I can say anything from anybody on this podcast if you listen. If you have an opportunity, sit with somebody who uses assistive technology, right? Whether that's high contrast mode, not just a screen reader, right, some type of assistive technology, because it will change your perspective on everything and make you be like, wow, what I just did was awful. I had a major impact on that. So ever since then, I jumped into accessibility. I was on State Farm's web accessibility team for a couple of years. I jumped to State Farm's accessibility team for about three of my years after that. Then I wanted to make the jump to do a little bit bigger reach again. I kind of said this in my intro. My goal was to reach out to developers because we'll get into this later as we go. But my goal is to reach out to developers because I felt like there is a gap. Developers are kind of like left high and dry. There's project managers, things like that. Be like, here's accessibility issues and go fix them, right? But nobody ever talked to devs about like, this is what you should be doing day to day. This is how you can fix accessibility issues. So we don't come knock on your door and say, here's the accessibility issues with it. So I went to Deque Systems, one of the best accessibility companies that's out there. I was there for about three years. I loved every second I was there. I got to do a lot of the JavaScript stuff that we're going to talk about, the automation pieces, things like that. I loved it. My passion, though, after I was there for a bit, was I wanted to kind of get back to when I was at State Farm. I was kind of part of that well-oiled machine that was already an accessibility team there was going. So when I jumped to Fidelity, it was more of like the beginning stages of it. So I wanted to build that, right? I want to take what I've learned, build that up, do the same things talked about from there. And really, it's been my passion the whole time. Right? And even outside of this, I think I mentioned this initially. I write all the time on dev.to, I write for a lot of different places. I talk atas many things as I can. And it's not out of like, me being like an egomaniac being like, I need to talk to people because I like to talk no because I feel like accessibility is something that is just flat out not talked about enough. There's not enough people even in my I'm 32. I know I have grays in my beard for anybody on here, but I'm 32. And I can tell you right now there's not a lot of developers that are newer coming out of college that are in their 20s, late 20s, even 30s past where I'm at, who know what the hell accessibility is. So my passion is to get in front of as many of those people as possible so I can give them ways in the environment that's out there for web. I can give them ways to deal with accessibility and make accessibility part of the daily process. So that's kind of my long-winded story, and we're going to get more detail on some of that stuff, but that's kind of how I fell into accessibility.

**Robbie Wagner:** [17:31] Nice.

**Chuck Carpenter:** [17:32] I think in general, I would agree with your statements around it not being like, top of mind for getting things to production. It's not only not top of mind or whatever else, but it's not like built into the definition of "done" for companies when they're trying to deploy products and features and all that kind of stuff. It seems like it's user feedback after-thought, and then you loop back. And then you loop back. And at least in my experience, and I can see that in enterprise to small. And at the end of the day, if you can somehow build it into process or tools to where even your startup MVP can have this kind of bolted on pretty easily, then that will increase uptake. But yeah, I think that it's great what you're evangelizing.

**Mark Steadman:** [18:17] Yeah. And even so, like we talked about, there a lot of things we see from definition of done is literally a checkbox that says "is accessible." Yeah, doh! What the hell does that mean? Right? What does "is accessible" mean? I can check that box too and be like, yeah, I checked this box "is accessible." Looks great, right? No, that's some of the small details with it.

**Chuck Carpenter:** [18:35] Yeah.

**Robbie Wagner:** [18:36] Were you able to check the box because the box was accessible? Is that what we're trying to do?

**Chuck Carpenter:** [18:40] That's what it is. You can tab through and hit enter.

**Mark Steadman:** [18:44] And what's great about, like, a lot of tools that devs use like Jira and things like that for issue tracking, they're pretty accessible, but there's still some that people use out there that aren't accessible. So, like, hey, you're asking for somebody who is a disabilities advocate and accessibility advocate to do that. They can't even click, like yeah, it's accessible. Some of the times. I've done that for some of my stuff in the past, way back when they would tell us to go through just naturally. When you start to do stuff, you start to just use keyboard instead of mouse. And I go there and be like, I can't get this checkbox it says has been accessibility reviewed. Awesome.

**Chuck Carpenter:** [19:13] Right?

**Mark Steadman:** [19:15] Accessibility at its core, right? Yeah, those things all existed.

**Chuck Carpenter:** [19:18] It's almost like a metaphor where someone has been asked to help make sure this is accessible, and they're like, okay, I'll check the box.

**Mark Steadman:** [19:25] Yes.

**Chuck Carpenter:** [19:26] And it is. No understanding of what that means.

**Robbie Wagner:** [19:28] Yeah, I think, and this is something I had a point to talk about here in our notes, but I think part of the problem is the traditional path to programming, which there's debate on all sides of, is HTML programming? Is CSS programming? It's all programming, but a lot of the traditional computer science type classes are based around, like, you're coding back end code on a mainframe somewhere, and it needs to run. No one is seeing it or doing anything with it. And I think that being the basis for how people until relatively modern times. The Internet's getting older now, but it's still compared to when coding started. It's still pretty young. People just haven't flipped that switch in like, coursework on computer science and stuff that we need to talk about how this can be used by other people and not just how you write a thing that runs and passes the tests and you're done, move on to the next thing.

**Mark Steadman:** [20:27] And it's a fundamental issue. So one of the things that I've talked about a lot, and truth to be told, it gets attention, but not the right level of attention, is when the JavaScript framework, like crazies, came in, everybody was like, hey, look at this. We can make faster sites, more data, more this, more that, right? All this fun stuff. What ended up happening was every single thing you just talked about was left in the dust. So when I was in college, I took one web course, literally, is like with JSP's and XHTML and stuff. It's like totally freaking irrelevant now, right? But now what it is, there's literally college courses on React. How the hell does that help anybody who needs to know basics of HTML? It doesn't. Because then what ends up happening is every single corporation. It's basically three layers. First is college courses. Just like you had said, right? College comes in, they say, well, corporation tells us we need to teach React, we need teach JavaScript. We got to do this right. So basic HTML, they say, hey, take this optional thing on HTML. Okay, sure. All three of us, private college students, guess what? You're going to take anything that's optional. Hell no, you're not going to take anything that's optional, right? So you're going to skip that. And then the next layer after that is when I get hired. So what do companies do to try to make them more flashy, right? Go out to a job board. React got to have this skill, this skill, this skill. Nothing in there says anything about basic HTML, says anything about basic CSS, right? It's all fundamental for that. So now business is driving. We need to do React, React, React, Angular, Vue, right? All those pieces from it, right? So we have to build all these things up from JavaScript. I know I'm saying React, Angular Vue. There's Ember, Svelte, all this fun stuff. Dude, but like.

**Chuck Carpenter:** [22:05] Ember is dead.

**Mark Steadman:** [22:08] I will be first to say.

**Robbie Wagner:** [22:10] Chuck is a hater.

**Mark Steadman:** [22:10] Ember should not be dead because it's got great accessibility documentation, but that's my plug for it. But I will say from that side of things, the last step of it then is the dev. Because now you have developers that get to the end goal. They have jobs. They have no clue what a button tag is. Everything is divs, everything spans. I talked about this, well I've done a talk on it, and I did an article on it. You get everybody into this tangled web of Aria, right? Accessible, Rich Internet Applications. Basically, you get these attributes you can put onto HTML tags that basically allow you to make it whatever you want to. I can make a div into a button and then role button to a screen reader user, right? I can do whatever I want to. But you end up with horrid front-end code, right? So the basics are not being taught in favor of this gigantic changing thing that's in front of you, right? And so that's just a major issue we see, and it doesn't get the attention. So I can sit here and talk to both of you. I can talk to developers and say, this is the problem. And developers, for the most part, I'm different on this compared to everybody else, will say, yeah, you're right, because developers say you're wrong, are only saying, no, you're wrong, because they have pressure from somebody else above them saying no, you got to be doing React only. Just focus on that. Don't worry about accessibility. Right? So that's where it comes from.

**Chuck Carpenter:** [23:21] Yeah. And that's the thing. You're learning one non native paradigm and API, first of all. So yes, React is very pervasive and whatever else, but I mean, in ten years, anything could be dead. So it's hard to say, but just regressing back to some of the things you're talking about. HTML, I can remember this in like the mid-2000s. Maybe you whipper snappers, don't. So I was coming out of table websites, and we're fighting about separation of concerns there, and we need HTML. And our JavaScript is a file here loaded in. And our CSS is a file here loaded in. No style tags and all this we're like going through all this massive fight, and I would say about mid-2000. It really was like it caught on, and people were doing it, and we had these separation of the concerns. 2014, React comes into play, and it does offer a lot of really cool bells and whistles. But JSX essentially began that regression from all of those things. And then everything is a component, right? Your hour is a component. Your anything is a component at this point. And the tags don't matter as much because the tags are just what class you created it as, and now whatever's in that class doesn't matter. And semantic HTML just ends up being fumbled because you're not really assembling your pages all in one place. Nobody has an understanding of that hierarchy. Remember the whole thing when it was like article in section came to be, and it gave you semantics into structuring articles, and you're supposed to be doing just 1H1 and breaking things down like that. Yeah, I would say that has very much gone to the wayside, which is a shame because, conversely, in terms of machine learning and machine reading of the Internet, it makes all of that very difficult. So there's accessibility, and then there's the machine learning aspect of it, too. You want to give things a purpose. Microformats, I mentioned this one recently, too. Microformat was a big push in that direction to have this agreed-upon set of rules of, like, this is a contact card, and now you understand what you're getting into and what each data bit is in there. So, yeah, all gone. And I blame JSX. True

**Mark Steadman:** [25:37] And that's the thing the truth of the matter is, I play this. Everyone says you're standing on the fence, and I do. I get the reason for why. There's JavaScript frameworks for React, for Ember, for Vue, for Angular. I get the reasons why right? In modernized web, a lot has to do with data. But if you look at a lot of stuff that's out there, right? The fundamentals just aren't there at all. Not even close to the point. If I went to somebody who is new out of college again, anybody who is listening to this and you're in college, I'm not saying like, you guys are wrong, it's just you guys don't know, right? Is if I said, hey, if I wanted you to make me a semantic HTML, give me some semantics on the page, I guarantee you they would not understand there's a nav element. They would understand there's a section, there's a content and post footer, right? All that stuff. They wouldn't know that.

**Robbie Wagner:** [26:18] There's a select.

**Mark Steadman:** [26:19] Yeah, there's a select, right? Yeah. So having these sweet selects to do like searches and all kinds of fun stuff, right? They can do that, right? Yeah. So those small things, and again, I come from that from a different angle. I look at that fundamental problem and say, how can we fix that problem that's out there? Because it's not going to go away. As much as I would love to sit here and be like, let's just do plain HTML pages with JavaScript and go, ain't going to happen. Too far, in deep. We got to figure out something which accessibility is as it usually is when we start to play catch up. It's super far behind now, and we have to play catch-up back to get to it.

**Chuck Carpenter:** [26:48] Yeah. So it's our responsibility within the industry to kind of lead and help people become successful and more knowledgeable. So it's sort of like that whole junior, fresh out of college, fresh out of accelerator, whatever else. They're not incentivized to provide that information. They're incentivized to go from graduation to hire in a short period of time. The success metric, companies are saying, this is what we want, this is what we need. From a hiring perspective, these basics are important. Let's just get productive. So we hire, and then they come into the industry. So, yeah, I think you're absolutely right on that point. And I think then that just shows that it's kind of on us, the elder statesmen and ladies, and they/them to provide that platform of like, hey, let's take a little time and go through some of this and just make sure that we're structuring the pages in a smart way that works for everyone.

**Robbie Wagner:** [27:42] Yes. I'd like to go back a minute to something I just remembered that I thought about when you were talking about building that map. And I think about things that Fidelity might have graphs, charts, visualizations. People know about accessibility. I don't know how many. And people think about, okay, let me do my tab indexes right. Let me use the right elements. But when you're getting into these things that are like really interactive visualizations, I feel like I personally know nothing about making that accessible.

**Mark Steadman:** [28:14] Sure.

**Robbie Wagner:** [28:15] Are there some knowledge tidbits around those sort of things you could share with some folks here?

**Mark Steadman:** [28:20] Oh, yeah, absolutely. Yeah. So visualization, data viz. Again, I will tell you this, everybody for accessibility has got one little speciality to get into. And so I always say there's someone else who knows more than me, so Sarah Fossheim, If I'm saying your last name correctly, they know way more than I do about the data visualization stuff. But in general, when you look at data visualization, it's not just like my current company. It's all over, like where you talk about, in general, data visualization stuff. So we want to look at with data viz is. You want to make it as simplistic as you possibly can, I say that. And both of you are going to be like, great, how do I make something that's like I'm showing, let's say overtime, I'm tracking money over time, right? Hey, where is this price at during this time frame? Where am I at during this time? How do I get that to people? So there's a number of different ways you can do it. One thing we always say the accessibility tidbit with it is I have to have a different way to get the data out to somebody. So what I mean by that is I can't just have a chart. I could have something like a table. So if it makes sense, if it makes sense like it's a bar graph that just basically has certain points on certain dates, I could put that into a table, have it as a separate way to click at the top, and I could see that data represented in a table. And so one of the things with that is it gives them the option to be able to see that. So this is not just screen reader users, too, right? People with cognitive disabilities consume data differently. So if I have a table there, gives them the option to be like, hey, I can look at this data in the speed that I want to. Not with color, now with everything like that, like, hey, where was I at on this day? Or where is this bar chart at this time? Right? That's one way. Another way, when you get to complex liners, I'm sure you see them all over the place. You go to Yahoo Finance, you go to Google stocks, or anything like that, right? You see them all up and down. You could give a summary point, too. Hey, what was the low, what was the highest, what's it at today? Right? And put that summary at some place underneath that as well to give them that point. That's more of, like consuming it more from a screen reader standpoint, from cognitive disability standpoint. But also, when it comes to the graphical content, people forget about this. The color schemes we use for the content that's there, you got to be able to have a color scheme that matches. So from a Web Content Accessibility Guideline standpoint, you have to have a color contrast compliant set of colors you're using, right? And on top of that, you really shouldn't just be using color only. You should be using some type of pattern. So, for example, once the field, back to the line graph that goes all over the place. Let's say I have a red line, I have a green line. Awesome. Let's say I'm red, green, color blind. How do I know the difference? Right? I know. So I can use different shapes on those spots. I can use different patterns on those spots, right. To be able to do that, there's a lot that goes into graphical content that's out there. And again, it's everywhere, right? I mean, if you want a really good example, any news site, if you ever see like election maps, new sites, always put election maps out there that are data viz all over the place, if you look at them, they're literally just red and blue states, right? Dope what state is that? Right? As simple as it might be for the three of us to be like, that's Illinois, right? That's Kentucky. It might not be. Right. So I got to put a label on to that. As simple as red and blue might be because the Democrat or Republican won that one, right? How do I know, right? So you have to be able to have different ways to contextualize data feedback. I could go on for a long time with this, but those are like the simplistic things to do, kind of, when it comes to data visualizations. Got you.

**Chuck Carpenter:** [31:39] Well, even your simplistic examples are like, oh, yeah, that totally makes sense once you've said it.

**Mark Steadman:** [31:44] Yeah, yeah, absolutely. And even like myself, when I look at I keep using line graphs because they tend to be like the one that everybody likes to show for trending data. They don't use bar graphs anymore. It's a lot of line graphs. Even when I look at them, I'm like, if you get five or six lines on there. I'm like, Hold on, that goes to what? That does what? Like, what are you talking about? Right, so it's nice to kind of have those patterns, those shapes to tell you, okay, I'm following this along the way. Got it. Or even so, I need a summary just for this piece I want to look at. Right. Show me a summary first. It was low, it was high, and through, so those small things can make data visualization much more accessible. But again, data viz is one of those areas. There's so much that goes into it and so many different things that can go along with it. So yeah, just looking at that, that's some small things in data viz. And I say small. You're looking at me like that's a lot. There's a lot that goes into data, viz. There really is.

**Robbie Wagner:** [32:37] Yeah. I think the more you layer on top of any app, the more you're going to have to dial it back and think about the base concepts to make it accessible. Because I think we talked about this on the last accessibility episode, where people have a lot of parallax scroll and animations, and crazy things that aren't really forms, and all this stuff is moving around, and it's like, what happens if I turn all that off? Does your site still work? Because I bet 90% of them no.

**Mark Steadman:** [00:33:03] Yeah, it's kind of funny because I made a joke one time with the people I work with. I was like, not sites that we work with, other sites out there. If I turned off JavaScript, which you can do, by the way, PSA alert for every out there, you can turn off JavaScript. I guarantee you half the websites that are out there would just be like blank white pages that do nothing. Because JavaScript is so prevalently used behind the scenes, nothing would be functional with it, and you'd end up with a page that is just horridly inaccessible, just bare bones, right?

**Robbie Wagner:** [33:31] Yeah, we use like static site generation for our page, so there's a separate pages, so it's a little bit better. But one of the things you get with the JavaScript framework with that is it kind of fakes that and still lives on top. And then when you page transition, you can fade in and out and stuff. Which you can't do with two HTML pages.

**Chuck Carpenter:** [33:51] Yeah, right. You still have to hit the server and rerender and all that kind of fun stuff.

**Robbie Wagner:** [33:54] Yeah, there's stuff in the works for actual browser transitions, but it's not there yet. But yeah, I don't know where I was going with that. But stuff like Astro, really.

**Chuck Carpenter:** [34:06] Have another.

**Robbie Wagner:** [00:34:06.910] - Really lets you make a site in the JavaScript framework model that you're used to and you like developing in and then ships all HTML and no JavaScript. That, I think, is the next wave of stuff.

**Chuck Carpenter:** [34:18] And we have server-side rendering too now, which is like essentially taking us back to what it used to be, and hardware is better. And instead of writing it in PHP, you get to write it in JavaScript now, I guess.

**Mark Steadman:** [34:29] Yeah. So right back to what you said, though, about the page transition things. In my time, I've probably spent consulting hours with teams being like, here's how you do page transitions between JavaScript frameworks because there's nothing to it. For those of you don't know, if I switch, I'm doing air quotes right now. If I switch between pages and a JavaScript framework, essentially a single-page app, focus just goes nowhere. Right. There's a lot of stuff out there. Marcy Sutton actually has some of the best stuff that's out there about what you should do for page transitions that's available. And so, a lot of things have it built in. It's starting to get better. Some applications actually start and have this built into the framework themselves. But page transition stuff, you don't think about it. But when I use the JavaScript framework, if I switch a page, nothing happens. If I don't control it, nothing happens. Right. It's not like static server render right behind the scenes where yes, it goes back to the top of the page, and I'm good to go. No, just float in the ether and do nothing. So I don't know if I've done anything or if the link is broken. Right. That's the number one complaint. When React started to get popular, actually, when Angular first started to get popular, that was the number one complaint was I click a link I had no idea what it did. Did I go somewhere? Did something new change? I don't know. Right. Because there's nothing that says a new page of load. There's no load. Just happens. Right. So that's some small things you don't think about with JavaScript frameworks accessibility.

**Robbie Wagner:** [35:44] Yeah, I know. There's like an Ember accessibility add-on that announces all your transitions and stuff like hooks into the router and.

**Mark Steadman:** [35:52] There is, because again, another PSA for this Ember is dope, and nobody knows about that because it's got some dope alley stuff to it. So I'm telling you.

**Robbie Wagner:** [35:59] That's what I've been saying for years.

**Mark Steadman:** [36:01] Thank you, see. Beautiful. Yes, it's popular has declined, but I'm telling you right now. It is awesome. It's got some great accessible documentation by Melanie. It's awesome. It is.

**Chuck Carpenter:** [36:10] I was going to say that's what it has it has Melanie Sumner.

**Mark Steadman:** [36:13] Yeah, absolutely.

**Robbie Wagner:** [36:17] So I guess we can continue down. Like, how would we integrate some of this into our development lifecycles and automated testing? And once we've learned about some of these things, finally, how do we keep ourselves on the right path and keep buying high for this sort of thing?

**Mark Steadman:** [36:35] Yes. So one of the things that I always tell development teams is accessibility is not a flip of the switch. In the field that we're at right now, there's not going to be something that JavaScripts out there and says, you're fixed, right? No, way that's not going to happen. It's the same thing with learning accessibility. A lot of people in the field, anybody you have on the show if you ask this question, say have you been asked the training to do one training and they'll know accessibility, everyone will say yes because it happens. Like every place I've ever been to, that happens, right? So it's a process, right? It takes time to get there. And one of the pieces that I would suggest, especially in the JavaScript framework worl,d is using automation. Now before everybody jumps the gun, does automation replace manual testing? Absolutely not, right? Manual testing comes along as part of the process with the development process itself, right? But to start with, if I use automation, whether that's a linter, believe it or not, there's accessible linters. So if you use something like axe linter, which is an axe for plug-in for linting, for React, Angular, I think it has stuff for Vue. But it can catch accessibility issues. Mind you, it's probably like a lower 25% just because it's a static code analyzer. It can catch that, though, as you go, right? Something like that, simple and plain, using a linter. But again, out there, if you use Vue, React, Angular, there's specific ES linters that have accessibility rules in there too. So no matter what, if you use a linter, it's got some accessibility rules. Turn them on, use it. That's first and foremost, that's the easiest automation to use. The next one is figuring out how do you integrate automation accessibility within your test cases. Right? There's basically like two schools of thought here. Do you do it at a unit level? So if I'm talking Angular, it's like Karma. If I'm talking React, is like with Ingest, or do I do it at an integration level? And my answer always is it totally depends on where your team is getting the most effective testing at. If I'm good in React. I'm testing with Jest, right? And I get that component-level testing. Fantastic. Right. Start there. Test your components. Make sure they're accessible, right? If you use something like Pa11y or people, call 'Pally' or Axe core, righ?. You're still looking at like 40% of accessibility issues that are going to be caught. But that 40% is huge. It can help you make a baseline accessible application. And if you notice those links that are inside there, like, hey, they're help links. They can help you learn accessibility. That's the biggest thing that's my biggest advocacy for automation is. It helps developers learn accessibility on the fly. So if I don't know what it means when somebody says this doesn't have an accessible name, I can click a link in like Axe core and take me out and say this is what it means for accessible name. So now I go got it. And now I can do that. As I go on, I'm doing it without thinking, right? So that's kind of the biggest benefits of automation. Again, like I said, it depends on where you want to do it. If you want a perfect world, I would say you do it at both a unit level and integration level. Let me tell you why. If I do a unit level for automation, especially like if I'm using a JavaScript framework, I might test the component. That component is 100% accessible. I throw three of those components on the page. They all have heading-level ones. Guess what? That doesn't make very much sense, does it? Right. Or maybe I have something that introduces multiple IDs. So you want to do multiple levels of tests to make sure that, hey, at a unit level, it's accessible, and at the integration level, it's accessible as well. Right. And so I always advocate for that as the golden child of like, yeah, this is what you should do. However, when you're getting started, that's where you want to start, right? Get the basics, lint, and then figure out where it's the best to do automation testing for your team. Where is it going to be the most effective? Where you are going to say, hey, I run these every day, I get the results? I fix them. Just doing that small bit gets teams thinking about accessibility, right. Those small little things of thinking of accessibility gets us moving in the right direction. Because again, we're not going to foul swoop this and say, yes, automation manual leggo, right? No, it's not going to happen. Do those small pieces, and they add up.

**Chuck Carpenter:** [40:23] But you know that engineers are very motivated by getting all the green dots and being able to hit that merge button. So I think that's the key thing. You show that as an organization, accessibility is important to you. You put the roadblock there, you give them helpful tools, and you just make it part of you want to merge your feature. You just have to get past this threshold.

**Mark Steadman:** [40:45] Yeah, exactly. And that's the next step. And the next step of it is now I make this as part of my code commit. I have to run a lint. I have to run accessibility test from an automation standpoint. Right. And once I have that, I have an automation strategy in place. Right. At a low level, people argue with me. There's a lot more that goes into, and there is. But that's a good automation strategy to have. Checking linting, I'm checking in my code for it. I have a check, whatever. I check in to GitHub. Whatever it is, they have automation running. I have no issues from it. Boom. Right? Automation is up and running.

**Robbie Wagner:** [41:15] Yeah, it's just like the more things you can remove as a concern, the more time you can focus on the things that you know, you can't automate. Like before Prettier came out, there would be so many PR comments like, oh, can you add a space or put a semicolon? Or like no, it doesn't matter anymore. All of them does everything. We're never going to have these comments again, right?

**Chuck Carpenter:** [41:36] Exactly.

**Mark Steadman:** [41:37] Yeah. And if my old teammates from my days at Deque were listening to this right now, like Prettier, I always used to be like, yeah, it's fine. Prettier said it's okay. And they'd be like, no, this looks awful when I checked in code. No, it's fine. Just let it go.

**Robbie Wagner:** [41:48] Yeah, it does some questionable things sometimes.

**Mark Steadman:** [41:52] Absolutely.

**Robbie Wagner:** [41:53] It is what it is.

**Chuck Carpenter:** [41:54] It ends up being a standard we can all agree on. So now that we're over that, like tabs or spaces, maybe we can make things accessible for people.

**Mark Steadman:** [42:01] Yeah. So then the next piece with that, though, like once I have automation in place, I'm a huge advocate for this. A minimum. You should start to introduce manual testing. Now, I'm never going to tell a developer. They have to be an accessibility expert. Yes. You can have an argument with me about you should have an accessibility champion on your team that's not a me. Right. Or somebody else that knows accessibility in and out. But you should at least know automation. I have that running. I'm learning a little bit. But you want to introduce small manual tests. And it's simple as having keyboard testing to where, hey, I always use the example because I have this in here. So whenever I do presentations, I do Star Wars-based stuff if you all notice the Star Wars stuff behind me. Right? I always have one. So I had one that I just did for one of my Axecon talks, and I did an Obi Kenobi Lightsaber behind it. And what I did was made it like Amazon. There was an image I could add to he cart, how many were left, all that fun stuff on it. Right? If I did that and I just did Aria only with that, guess what? I might see that. If I just had Aria roll button and I use keyboard test just to click that a button doesn't actually, or something that's not made with a button does not have the ability to click enter a space. I have to fill that in that is caught with keyboard testing. Right. As simple as that is, adding keyboard testing is just enhancing your accessibility definition of done. Right. And even if you don't have keyboard testing, right? If you can go above and beyond keyboard testing, I always include whether it's QA or your developers that are doing this. There's like quick little visual tests you can do. Right? As simple as did I use color alone? Right? The color alone indicate that this has an error. This just read that shows as an error. No, it's a problem. Right? Cool. I got to fix that. Did that input field that I make have a persistent label that didn't go away? Boom, Accessibility checked, right? Those are visible things I can do really quickly as I go through. And that can be a part of definition of done. Everybody hears manual accessibility testing, and they freak out. They go, oh, yeah, you're telling me I got to learn a screen reader. No. Would I love you to learn a screen reader, how to use it, how to go through with it testing your content holistically? Absolutely. But we're talking about building steps from automation to doing manual testing, and that's how we get there. It's doing small things like keyboard testing and then small visual tests with that. Is it perfect? No, it's imperfect. But it does catch more accessible issues and build that confidence in development teams so they can make content that is accessible. Right. And that's the whole goal of it.

**Robbie Wagner:** [44:20] Yeah, for sure. So let's move into some whatnot here.

**Chuck Carpenter:** [44:25] Yes. I think you opened the door there with Star Wars.

**Mark Steadman:** [44:28] Yeah.

**Robbie Wagner:** [44:29] Obviously, you like Star Wars. We see a few things behind you. Tell us about that. Do you like everything Star Wars has put out? Are there any like? Have you watched all the shows? Mandalorian, book of Boba Fett, all the things? Is there anything you're like, oh, this doesn't track with everything else or?

**Mark Steadman:** [44:45] Yeah, so I'm not one of those people that's just like, I watch the Star Wars show, and, like, this is the worst. I'm done watching this stuff. I'll watch all the stuff. There's stuff I like more than that. So if you take something as an example of, like, the Obi-Wan Kenobi Show. Obi-Wan Kenobi Show. Last two episodes got to where they wanted to get to. Why we need four more episodes before that, I don't know. Right? Like, cool. You want to have a re-showdown with Darth Vader. Got it. Just make that happen. Just be like, cool. They realize the Anakin discovers his lightning. That stuff Boba Fett if you take it for what it is, it's essentially four episodes about Boba Fett being a leader, and then the rest is about being a Mandalorian spin off. Okay, that wasn't what I expected with it, but it's what it is. I watch everything, though.

**Robbie Wagner:** [45:25] It just made me want more Mandalorian.

**Mark Steadman:** [45:27] Yeah. Kind of like right when episode five came back with like Return of the Mandalorian. I was like, this is awesome. And I was like, oh, wait. I should be cheering for Boba Fett right now. Like, wait, what's going on? So they have some good stuff. They didn't know what they were doing. My thing with Star Wars is this. I would go super nerd here. Just like, when it comes to the Jedi stuff, they've done those stories. They pushed them and do some other stuff. I'm really excited for the Andor stuff because Rogue One was awesome. The Andor stuff is cool. I watched all the way to the animated stuff. As you can tell. I have The Bad Batch back here, too. It's like, Bad Batch is cool because there's no, like, Force users just about, like.

**Chuck Carpenter:** [46:01] Rebels.

**Mark Steadman:** [46:02] Yeah.

**Chuck Carpenter:** [46:02] You got Rebels. Isn't that where they first introduced that Mandalorian lightsaber? Right?

**Mark Steadman:** [46:07] Well, they introduced it in Clone Wars, too. The darksaber is right here, just so you all know. It's sitting right off camera. But yeah. So all that stuff in general, I like it. I dislike some stuff like the sequel trilogies. I'm a different person with the sequel trilogies weren't too bad. The last one I didn't like only because they took the fan backlash for the last Jedi. And they were like, let's just not do any of the stuff we're talking about here and let's just offride it and just bring back emporer no, like people didn't like it then write yourself out of that, off of what they did. But they just backtracked all of it. And I was like, no, not a fan. I go back and forth, back and forth. I actually just went this June. My son, who is going to be two next week.

**Chuck Carpenter:** [46:47] Very nice.

**Mark Steadman:** [46:48] We went down to Disney World for the first time. So I got to go to Star Wars land. So I kind of told my wife.

**Robbie Wagner:** [46:52] Nice.

**Mark Steadman:** [46:52] Yeah, we went to Hollywood Studios, told my wife. I was like, yeah, you all can go do whatever you want. I'm just going to stay here like all day.

**Robbie Wagner:** [46:58] I'll see you later.

**Mark Steadman:** [46:59] I might have dropped a lot of money on that stuff. I got to build two droids built a lightsaber. It's off over here. You have to buy, like, a special stand for it because if not it would just fall off my wall. But I did all that stuff. It was super awesome. It was so cool. People give Disney flack for a lot of stuff with that. But, like, Star Wars land stuff is super cool. It really is.

**Chuck Carpenter:** [47:15] Yeah.

**Mark Steadman:** [47:16] It's really a cool experience.

**Chuck Carpenter:** [47:17] I got to drive the Millennium Falcon twice. I know.

**Mark Steadman:** [47:20] Yeah. I was an engineer on that, so I didn't get to do anything cool.

**Chuck Carpenter:** [47:25] Nice. There's a hack there. So they have this thing called I don't know. It's sort of like the family pass thing. So it's sort of like if you waited through line once and someone was hanging back watching the kids, you can actually go back and then come back to the line and skip ahead.

**Mark Steadman:** [47:42] Really?

**Chuck Carpenter:** [47:43] Then do it a second time? Yes.

**Chuck Carpenter:** [47:44] Wow. I didn't know that.

**Chuck Carpenter:** [47:46] I forget what it's called exactly. I'll have to share that hack.

**Mark Steadman:** [47:48] Please do.

**Robbie Wagner:**[47:49] Not like the paid FastPass thing.

**Chuck Carpenter:** [47:51] No, it's different than FastPass. It's this whole family thing that you get to do, and you're like, and they know because you scan, and they're like, oh, yeah, I guess you were just here or whatever. And you just get to skip and do a second ride.

**Robbie Wagner:** [48:04] Interesting.

**Chuck Carpenter:** [48:05] With, like, the other person who didn't get to because they were hanging back with kids.

**Mark Steadman:** [48:09] That's cool.

**Chuck Carpenter:** [48:10] So with young kids, that's kind of a thing.

**Mark Steadman:** [48:12] Nice.

**Robbie Wagner:** [48:12] Yeah, I could see that being abused. But I think the spirit of that is a very good idea.

**Mark Steadman:** [48:17] Sure.

**Chuck Carpenter:** [48:17] Yeah. I think a lot of people don't know. I went with a Disney employee, so that helped. He knew what was going on.

**Mark Steadman:** [48:23] Well, there you go.

**Chuck Carpenter:** [48:24] Yeah.

**Robbie Wagner:** [48:24] And he couldn't just get you immediately to the front.

**Chuck Carpenter:** [48:27] No, they don't get those perks or whatever else. But he did know, like, you can do this. He actually works in the department for the ticketing system for the parks.

**Mark Steadman:** [48:39] Cool.

**Chuck Carpenter:** [48:39] Fun fact.

**Robbie Wagner:**[48:41] Yeah. I don't know enough about Star Wars to continue talking about Star Wars. Honestly, I've watched all of them, but I don't remember all deep into the lore and everything.

**Chuck Carpenter:** [48:50] I know lots of things. I found Obi-Wan very. I mean, I was born the year the first Star Wars came out, so I feel akin to it.

**Mark Steadman:** [48:59] Sure.

**Chuck Carpenter:** [49:00] And I was deeply satisfied by the clash of Darth Vader and Obi-Wan in Obi-Wan. I don't know yet my brother was like, I didn't like it, complaint, complaints, and I was like, I don't know I was satisfied by that interaction, so it worked for me.

**Robbie Wagner:** [49:15] Yeah, it was kind of fun because the stuff after this has already happened that no one's going to die, so you don't have to be like, stressed and like, oh, my God, what's going to happen? You know.

**Mark Steadman:** [49:26] What a twist. That killed Obi-Wan at the end. Oh, my God. Redo all the Star Wars lore. Right?

**Chuck Carpenter:** [49:31] Yeah. Wait a minute. Well, for me, it was like, good because there was really nothing to their fight in A New Hope.

**Mark Steadman:** [49:38] Yeah.

**Chuck Carpenter:** [49:39] They're like like, oh, clashed lightsabers a couple of times, and Obi-Wan is like, I give up. Oh, that's really underwhelming. But then, you know, he's just old and carrying this burden for so long, and they had these he had all this guilt, and they've had these clashes, and here it is. They're kind of at their peak, in a way.

**Mark Steadman:** [49:59] Yeah. I did think it was dope, though, because the fact of the matter is, they spent the whole one show. Sorry, spoilers for anybody who hasn't watched Obi-Wan yet but.

**Robbie Wagner:** [50:07] We're past that now.

**Mark Steadman:** [50:09] And he's helping to rescue Leia, and it's Luke. I think he's pretty cool now, though. Like, if you look at New Hope, where he sees Luke and Leia together, and that's when he actually gets rid of his lightsaber and lets him get killed. I think it's actually kind of cool now. They've both been like, hey, they're together. Yeah. You're screwed, Darth Vader. I'm just going to let you kill me now. I think that's actually kind of cool. Like, that part of it where they build that up, too. But again, those are, like, small details they build in for super nerds like myself where I'm like, that's awesome, that's really cool.

**Chuck Carpenter:** [50:35] Yeah, that's pretty cool.

**Mark Steadman:** [50:37] All right.

**Chuck Carpenter:** [50:37] We can talk about other things, Robbie, so you don't feel less than.

**Robbie Wagner:** [50:41] Yeah, whatever. I know a little bit about college football.

**Chuck Carpenter:** [50:44] I know nothing.

**Mark Steadman:** [50:45] Oh, geez.

**Robbie Wagner:** [50:46] Which I hear you're a fan of. Yeah, but Chuck only likes proper football.

**Chuck Carpenter:** [50:50] I only like proper football, not this egg ball game.

**Mark Steadman:** [50:53] So have to ask each other, what's proper football team then?

**Chuck Carpenter:** [50:56] Well, that would be European football.

**Robbie Wagner:** [50:58] Like football.

**Mark Steadman:** [50:59] Yes, that's fine. Personally, I don't watch soccer, but that's not all of my friends. When I was growing up, they were soccer fanatics. I never got into it. The only thing I like about soccer is the crowds because I think the crowds are awesome and hilarious. I think it's great, but I just never got into football myself. Football, sorry.

**Chuck Carpenter:** [51:17] I just make that joke.

**Mark Steadman:** [51:18] Yeah.

**Robbie Wagner:** [51:19] So let's talk about football.

**Mark Steadman:** [51:21] Yeah. So my thing is for everybody on here, people who have seen me talk for like, I wear backwards baseball cap every single time. Also, because I have no hair, but I collect hats. I'm one of five people in Illinois who are a White Sox fan. Everybody else is a cubs fan, for God sakes. But I do collect hats. What I do, I'm a huge college football fan, so what I actually do is go wherever I travel for work. So when I was at the Deque, I would travel a lot more for work than I do now. But I would travel, and I would go to certain cities, and I'd say, hey, what college football team is there? And I would go find their stadiums themselves. I can't say I've snuck onto some stadiums. I successfully snuck on the Stanford football field. I got told to leave. I just walked into press entrance and was like, hey. I couldn't think of a press name, so I was like, okay, bye. There's a couple of things I've walked on to, and every place I go to, I collect that. I try to buy a hat from there then, too. It's kind of like a little memento as I go. But as I do those, I really do like to see the stadiums get as close as I can. I don't sneak onto every stadium, I'm not that kind of person. But recently, the most recent one, when I was in Raleigh for a trip for Fidelity, I was actually at North Carolina State Stadium. So my teammates were listening to me say the same thing I'm telling you all, and they're like, you like to go to football stadiums? Like, are you going to run on the field and get arrested? Like, no, I just like to see them. Like, be like, hey.

**Chuck Carpenter:** [52:36] Fully clothed, fully clothed.

**Mark Steadman:** [52:38] We're not streaking across. So yeah, it's one thing that I do like to do, though. It's one of those things where I growing up, always watch college football. I thought it was a cool thing. Similar to what we were talking about with soccer. Right? I liked college football just because of the crowds. Different traditions, different stuff like that. And so that was one of the things that I wanted to do, is see some of the stadiums where these things happen. So Stanford Stadium was cool to me because it's kind of like a square, which is weird for a stadium set up for football now, but it's really cool to see in person. Like, this is an old stadium, bench, seating, all that stuff. And like, this is really cool. It's really cool to see. So I always do that just because for me, it's one of the nerd things I do is I go there, I'll buy something that's like from the university, things like that. But I think it's really cool just to go see those stadiums. And solely because I like the crowds of college football, similar to football itself.

**Chuck Carpenter:** [53:22] That's why I like live sports. Actually, even sports, I don't care for most of the time. I'm like, I pretty much always say yes to going to live sports because the atmosphere is fun. I don't really want to watch golf that much, but the atmosphere is kind of fun, believe it or not.

**Mark Steadman:** [53:37] Sure.

**Chuck Carpenter:** [53:37] Especially here. We have the Phoenix Open, so it gets, it's like an insane party here. They're a little louder than most of them.

**Mark Steadman:** [53:44] I was going to say when you get a hole of one of that one hole, don't you just throw beer on the thing. My father-in-law showed me that one, and I was like, I don't even know the thing. Like, what?

**Chuck Carpenter:** [53:51] Yeah. I mean, I don't, but ye,s people do.

**Mark Steadman:** [53:56] I don't. Yeah.

**Chuck Carpenter:** [53:57] But I understand, you know, and I've been to Old Trafford a few times, so I think that's 80,000, 80-something. I've been to the Camp Nou in Barcelona, which is somewhere like 90,000 plus.

**Mark Steadman:** [54:08] Wow.

**Chuck Carpenter:** [54:08] Italy, the San Siro in Milan is like, 90,000.

**Mark Steadman:** [54:12] Cool.

**Chuck Carpenter:** [54:13] Yeah, it gets pretty nuts.

**Mark Steadman:** [54:14] That's pretty cool.

**Chuck Carpenter:** [54:15] So I'm from Kentucky, but I went to the University of Cincinnati. Have you been to either stadium?

**Mark Steadman:** [54:19] I've seen Kentucky Stadium. I've not been to University of Connecticut Stadium. I have not been to Cincinnati Stadium. I've been to Ohio State. So, like, going through Ohio, I''ve been through Ohio State Stadium. I've seen Toledo Stadium, the Rockets. I've been through there. I'm trying to think of another one off the top of my head. But I think that's it for Ohio, but I've not seen Cincinnati's.

**Chuck Carpenter:** [54:38] I mean, Ohio State's way more impressive.

**Robbie Wagner:** [54:41] Depends who you ask.

**Mark Steadman:** [54:43] Yeah, I was going to say I've seen Ohio stay, I've seen the big house, and you see them coming from like, 16 miles away. My goodness, gracious, these are freaking, like, cathedrals, for crying out loud. For football. Like good Lord.

**Chuck Carpenter:** [54:54] Yeah.

**Robbie Wagner:** [54:55] I have a much hatred for Ohio State because it's less so now, but they used to just be like, oh, they're the best ever. So good. Everyone thinks they're so good. And they would play like Miami, Ohio, and places you've never heard of and win all their games, be like, look, we're undefeated. And it's like, well, but did you play anyone? I think they perpetuated this myth that they were good, which then got them good players because they faked being good, and now they're actually good. You know what I mean? So I have a little bit of hatred from that. Like, Alabama is just like, we're good anyway. We have always had good people. We will demolish you. Like Ohio State is like.

**Mark Steadman:** [55:36] It don't matter.

**Robbie Wagner:** [55:37] We football sometimes we're good. Everyone thinks we're good. I don't know.

**Mark Steadman:** [55:42] I grew up in Michigan fan, just because I like Michigan football, like the way it was run. And I played high school, so I grew up Michigan, so I didn't like Ohio State either. My really good friend's wife is Ohio State fan, so I might just share that clip you just said directly with her and just be like, there you go. Ohio State's just a bunch of fakers. They're not that good at football.

**Robbie Wagner:** [55:58] But now they are good. Like, they're getting good recruits now because of the prestigious program. But yeah, I mean, that's one way to do it, right? You fake it till you make it, and then works with anything.

**Mark Steadman:** [56:09] Yeah.

**Chuck Carpenter:** [56:09] There you go. Maybe that's what Cincinnati did because we were horrible when I went there. We were all basketball school, and then we lost our coach and other things happened and I don't know. I heard in the last few years they've been better. I don't really know anything about it.

**Robbie Wagner:** [56:22] Yeah, they were really good.

**Mark Steadman:** [56:24] Since then, they made college football. They made the college football playoff last year. They're really good.

**Chuck Carpenter:** [56:27] Well, see, there you go.

**Robbie Wagner:**[56:28] Then got immediately demolished.

**Mark Steadman:** [56:30] But then they played Alabama.

**Chuck Carpenter:** [56:32] And then it was like, we actually play football. See ya.

**Robbie Wagner:** [56:36] Yeah. It's just a difference in like, what they did was really impressive because they like actually you know. All season long, they're showing like before and after pictures of Cincinnati players working out and stuff. And they really beefed up and did well. But they just were not on the same level as like. You know the kind of people you're paying probably hundreds of thousands of dollars to play college football right now.

**Chuck Carpenter:** [56:57] I mean, that's true. I can remember going down to the University of Kentucky to hang out with some friends, and any time the basketball players would like, show up on the main drag to go to parties and stuff. They rolled up in a Range Rover and stuff. And you're like, oh, you're a college freshman. I'm pretty sure.

**Robbie Wagner:** [57:13] Yup.

Chuck Carpenter : [57:13] Yeah, we know what's going on.

**Mark Steadman:** [57:15] And now with the money stuff, there's no hidden payments. They're just like, yeah, we're paid out in the open because of the change of college football. So now nobody cares, right? They're like, sweet. Yeah. This booster paid me $20,000. Here's my dope car. Nothing else you can do about it because of the law changed so.

**Chuck Carpenter:** [57:29] Yeah.

**Robbie Wagner:** [57:30] Yeah. So if we're going to do that, why don't we just make the playoff longer now? Let's do it. Let's have lots more paid football.

**Mark Steadman:** [57:36] I said it. Perfect system for college football is eight teams. At this rate, all the conferences are going to merge together. But your power five conferences. Get your championship winner, three at largest. Done. There you go. There's your perfect imperfect system. Get your five teams in from conference championship, get three to get in, and guess what? If you don't win your conference championship game, you go into that three. Too bad you didn't win. That's my thing with it. But it'll go to, like, 32 teams you watch because they want that money. It'll just be a long process. It doesn't make any sense.

**Robbie Wagner:** [58:06] Yeah, right back to Disney. More Disney money from ESPN.

**Chuck Carpenter:** [58:11] This is why tournament champions are a farce, and they're a separate title whatsoever. This is what I like about European football is you've got to grind it out for 38 games, play a Monday night and shitty weather and whatever else, and collect your three points or not, and at the end of it, you are the best team.

**Mark Steadman:** [58:29] Yeah, I actually like the soccer system for that. Like, the regular season matters. Most times, we talk about regular seasons and not just football in general. It doesn't matter how much football regular season does matter, but some other sports, like the NFL, you can afford to lose two games. We just didn't try on Sunday. Right, right. You cannot do that in soccer. You can't. Like, if you do, then you risk the chance of even winning anything. So that's why soccer system is perfect. It is.

**Chuck Carpenter:** [58:53] Yeah. You get nothing otherwise. And then, yeah, tournaments can be for something else, but you can't be like a mediocre team all season and then turn it on during these two weeks. Bullshit.

**Robbie Wagner:** [59:04] The way Tom Brady does.

**Chuck Carpenter:** [59:07] He just gets by. He just gets by. He's like 45.

**Mark Steadman:**[59:11] Yeah. Just love Tom Brady be an old man who thinks he's just awesome. I used to hate Tom Brady so much, but, like, at this time, I'm just like, My gosh, you're 45. Just slinging the ball around, winning Super Bowls, whatever go do you, man. Go do you.

**Robbie Wagner:** [59:24] I'm much more impressed and less annoyed at him now that it's like, I'm still good.

**Mark Steadman:** [59:29] Exactly. Yeah. Once you leave the Patriots system of being like, yeah, it's the system, and then you go win, it's like, okay, you're actually really awesome. Never mind. Yeah, really good.

**Chuck Carpenter:** [59:39] Yeah. You've definitely shown something. That's true. I can agree with that in general, where if you are crushing it in a team built around you, okay, sure. Good. But everybody's good. It's a team thing. If you can go somewhere else and just be a multiplier and get it done. Well, now it's you.

**Mark Steadman:** [59:56] Yeah, absolutely.

**Robbie Wagner:** [59:59] All right, well, over time here, was there anything we missed? Anything you would like to plug? Anything at all before we end here?

**Mark Steadman:** [01:00:07] My only last plug is if you are a developer listening to this, take the time to put accessibility as a priority. As much as everybody in the world is going to tell you that priority for accessibility is not there. Something else is on top of that. Find time. I always send this message of ten minutes a day. Ten minutes a day of accessibility helps you learn accessibility at a small rate, but it lets you figure out what things you want to learn that are relevant to you in your role. Ten minutes. Literally less than 1% of your year from work. Take ten minutes a day. Build that up. Build the accessibility knowledge base. And it will make the world more accessible. Some people disagree with me on that but take it. Small chunks add up to big gains in the long run.

**Robbie Wagner:** [01:00:49] Yeah, definitely. Thanks, everybody, for listening. If you liked it, please subscribe, and we will catch you next time.

**Chuck Carpenter:** [01:00:59] Thanks for listening to Whiskey Web and Whatnot. This podcast is brought to you by Ship Shape and produced by Podcast Royale. If you like this episode, consider sharing it with a friend or two and leave us a rating, maybe a review, as long as it's good.

**Robbie Wagner:** [01:01:14] You can subscribe to future episodes on Apple, Spotify, or wherever you get your podcasts. For more info about Ship Shape and the show, check out our website at shipshape.io.
