/**
 * Philadelphia / Delaware Valley foodshed.
 *
 * A region module is the unit of localisation: swap this file for another
 * region and the rest of the app is unchanged. See README for the shape.
 */

export const philadelphia = {
  id: "philadelphia",
  label: "Philadelphia",

  /* shown in the masthead meta rail */
  facts: [
    ["USDA zone", "7a–7b"],
    ["Last spring frost", "≈ Apr 12"],
    ["First fall frost", "≈ Nov 2"],
    ["Growing season", "≈ 200 days"]
  ],

  /* month is 0-indexed, day is 1-indexed. Drawn as dashed marks on the scale. */
  frost: {
    last:  { month: 3,  day: 12 },
    first: { month: 10, day: 2 }
  },

  /* week boundaries are inclusive upper bounds; the last entry catches the rest */
  seasons: [
    { until: 8,  name: "Deep winter" },
    { until: 12, name: "The lean weeks" },
    { until: 16, name: "Early spring" },
    { until: 21, name: "Spring" },
    { until: 25, name: "Late spring" },
    { until: 29, name: "Early summer" },
    { until: 35, name: "High summer" },
    { until: 39, name: "Late summer" },
    { until: 44, name: "Autumn" },
    { until: 48, name: "Late autumn" },
    { until: 52, name: "Onset of winter" }
  ],

  /* chrome stays monochrome; all colour belongs to the crops */
  categories: [
    /* Eight pigment-deep hues for the warm ground. Each carries its category
       everywhere it appears, and every one is used both as coloured 10.5px chip
       text and as a filled chip with panel-coloured text on top, so each clears
       4.5:1 in both directions — see test/palette.test.js, which also holds the
       eight apart in OKLab under simulated protanopia and deuteranopia. The
       warm family is laddered in lightness (vine brightest, then fruit, then
       root deepest) because simulated dichromacy collapses red/orange/gold/
       green onto one axis and lightness is the only separation left there.
       Values are computed, not eyeballed; retune them with the tests, not by
       hand. The "r,g,b" string is load-bearing: chart.js, reader.js and
       drawer.js interpolate it straight into the --rgb custom property. */
    { id: "fruit", name: "Fruit & Berries",          rgb: "146,22,70" },
    { id: "vine",  name: "Fruiting & Vine Crops",    rgb: "175,69,6" },
    { id: "root",  name: "Roots, Tubers & Alliums",  rgb: "103,67,0" },
    { id: "leaf",  name: "Leafy Greens & Salad",     rgb: "28,117,48" },
    { id: "brass", name: "Brassicas, Stalks & Pods", rgb: "0,80,63" },
    { id: "herb",  name: "Herbs & Aromatics",        rgb: "34,109,126" },
    { id: "fungi", name: "Mushrooms & Foraged",      rgb: "110,73,157" },
    { id: "water", name: "From the Water",           rgb: "33,63,139" }
  ],

  /* [name, categoryIndex, windows, note]
     window = [startWeek, endWeek, kind]
     kind: s = available · p = peak · t = storage/glasshouse */
  crops: [
  /* --- FRUIT & BERRIES --- */
  ["Rhubarb",0,[[15,25,"s"],[17,21,"p"]],"Lancaster County field stalks. It behaves like fruit and tastes nothing like it; the sugar is your problem."],
  ["Strawberries",0,[[20,26,"s"],[22,24,"p"]],"Chester County and South Jersey. The local season runs about four weeks and then it stops, which seems to surprise people every year — the flats stacked up at every corner store in July came from California, picked hard and trucked. A local berry is soft, dark red the whole way through, and will not survive a second day in the fridge. That is the difference."],
  ["Sweet cherries",0,[[24,27,"s"],[25,26,"p"]],"Weather-fragile. A hard rain at colour split can end the crop in a day."],
  ["Sour cherries",0,[[25,28,"s"],[26,27,"p"]],"Montmorency, too sharp to eat raw. They cost less and make the better pie."],
  ["Blueberries",0,[[25,33,"s"],[27,31,"p"]],"Hammonton, New Jersey calls itself the blueberry capital of the world and has a reasonable claim on it. The town is forty minutes from Center City, and the sand plains around it grow more highbush blueberries than almost anywhere. The season runs long by local standards, most of July into August, which is unusual enough here to be worth noticing."],
  ["Black raspberries",0,[[25,28,"s"],[26,27,"p"]],"Two weeks, maybe three."],
  ["Red raspberries",0,[[25,29,"s"],[26,28,"p"],[34,42,"s"],[36,40,"p"]],"Two crops. A summer flush on last year's canes, then a longer autumn run that goes right up to frost and is the better of the two."],
  ["Blackberries",0,[[28,35,"s"],[29,33,"p"]],"Thornless cultivars from late July. Hedgerow brambles run a fortnight behind."],
  ["Currants & gooseberries",0,[[25,29,"s"],[26,28,"p"]],"Rare here. A few growers keep them going."],
  ["Apricots",0,[[27,30,"s"],[28,29,"p"]],"Late frost takes the crop one year in three."],
  ["Peaches",0,[[28,37,"s"],[30,35,"p"]],"Jersey and Adams County, and the state ranks near the top nationally for them. Yellow varieties come first. Whites arrive from mid-August, and the last freestones of the run, once the nights have started cooling, are the best of the year."],
  ["Nectarines",0,[[29,36,"s"],[31,34,"p"]],"Same orchards as the peaches, a week behind."],
  ["Plums",0,[[31,38,"s"],[32,36,"p"]],"Japanese types first, then Italian prune plums in September. Those are the ones for roasting."],
  ["Cantaloupe & muskmelon",0,[[30,37,"s"],[31,35,"p"]],"Jersey sand soil grows a very good melon. The stem end is where the smell is."],
  ["Watermelon",0,[[31,37,"s"],[32,36,"p"]],"Local fruit lands long after the supermarket started selling southern melons."],
  ["Elderberries",0,[[32,37,"s"],[33,35,"p"]],"Hedgerow and small-farm fruit, almost always cooked. The flowers come six weeks before."],
  ["Figs",0,[[33,41,"s"],[35,39,"p"]],"A South Philly institution. The trees are marginal this far north, so every autumn they get wrapped in tarpaper and old carpet and whatever else is to hand, then bent over or buried, then uncovered in spring. Walk the alleys off Passyunk in late August and there is fruit. The practice arrived with Italian families and has since been taken up by Southeast Asian ones."],
  ["Apples",0,[[32,46,"s"],[36,43,"p"],[47,52,"t"],[1,18,"t"]],"Ginger Gold and the early Galas turn up in August, thin and mostly for cooking. The season's real work is done by the keepers. Goldrush and Winesap go into cold storage in October and come out in March still worth eating, which is why apples are the only local fruit on this chart in all twelve months."],
  ["Pears",0,[[33,43,"s"],[35,40,"p"],[44,50,"t"]],"Pears ripen off the tree rather than on it, so they arrive hard. Bartlett first, then Bosc and Comice into October."],
  ["Asian pears",0,[[35,42,"s"],[36,40,"p"]],"These do ripen on the tree, and hold for months cold."],
  ["Grapes",0,[[35,42,"s"],[36,40,"p"]],"Concord and Niagara. Slip-skin, heavily perfumed, not much like a table grape."],
  ["Pawpaw",0,[[34,40,"s"],[36,38,"p"]],"The largest fruit native to North America: custardy, somewhere between a mango and a banana. It bruises in two days and will not ship, which is the whole reason it never made it into commercial agriculture despite growing wild across the entire eastern half of the country. Pennsylvania has a small but serious pawpaw scene."],
  ["Persimmons",0,[[40,47,"s"],[42,45,"p"]],"Asian varieties at market. The wild American ones grow along field edges and are inedible until after a hard frost."],
  ["Quince",0,[[40,46,"s"],[41,44,"p"]],"Inedible raw, very good cooked. A few old orchards in Bucks and Chester counties still have trees."],
  ["Cranberries",0,[[40,47,"s"],[41,45,"p"]],"The Pine Barrens bogs put New Jersey among the top producers in the country. They freeze without any loss."],

  /* --- FRUITING & VINE --- */
  ["Zucchini & summer squash",1,[[24,38,"s"],[26,34,"p"]],"Arrives in June and then will not stop. By August the grower is trying to give it away."],
  ["Squash blossoms",1,[[25,33,"s"],[26,31,"p"]],"Male flowers, cut at dawn, sold the same morning. They last a day."],
  ["Cucumbers",1,[[25,37,"s"],[27,34,"p"]],"Slicers from late June. The small Kirbys for pickling peak in the back half of July."],
  ["Green beans",1,[[25,38,"s"],[27,35,"p"]],"Successive sowings give a long run. Dragon tongue and haricots verts come from the smaller growers."],
  ["Field tomatoes",1,[[29,41,"s"],[31,38,"p"]],"The whole point of the year, and the reason the last week of July matters more on this chart than any other. Jersey field fruit wants heat in the soil and a warm night, so anything appearing much before then was grown under glass and tastes like it. Reckon on six weeks of genuinely good fruit and then a long tapering off."],
  ["Cherry tomatoes",1,[[27,41,"s"],[29,38,"p"]],"A fortnight ahead of the big ones, and they run later into the cool nights."],
  ["Heirloom tomatoes",1,[[30,39,"s"],[31,37,"p"]],"Brandywine takes its name from the Chester County creek, though where the variety actually came from is argued over and probably not settled; the usual story credits an Ohio nursery in the 1880s. It grows here as though it belongs, which is the part that matters. Expect cracking and a low yield. Both are normal."],
  ["Tomatillos",1,[[30,39,"s"],[31,36,"p"]],"Grown seriously here now for the city's Mexican kitchens. The husks should be tight and papery."],
  ["Sweet corn",1,[[27,38,"s"],[30,35,"p"]],"Bicolour and white supersweets, mostly. The first fortnight of August is the top of it. Sugar starts turning to starch within an hour of picking, which is the argument for buying it at a stand within sight of the field, and the reason the old advice was to put the water on before you went out to pick."],
  ["Sweet peppers",1,[[29,41,"s"],[31,38,"p"]],"Green all summer. The ripe red, yellow and chocolate ones cost about twice as much and arrive in September."],
  ["Hot peppers",1,[[30,41,"s"],[32,38,"p"]],"Long hots for frying are the local staple. Habaneros and the slow-ripening chillies turn up in September."],
  ["Eggplant",1,[[29,40,"s"],[31,37,"p"]],"Globe, Italian and the slim Asian types."],
  ["Okra",1,[[30,39,"s"],[32,36,"p"]],"It likes the humidity here. Over four inches long and they turn to rope."],
  ["Lima beans",1,[[30,38,"s"],[32,36,"p"]],"Fresh shelling limas bear no relation to the frozen ones. Sold in the pod, usually by the quart."],
  ["Edamame",1,[[30,37,"s"],[31,35,"p"]],"A few growers sell it still on the stalk."],
  ["Winter squash",1,[[35,48,"s"],[37,44,"p"],[49,52,"t"],[1,8,"t"]],"Delicata and acorn first, and neither keeps. Butternut, kabocha and hubbard hold in a cool room until spring."],
  ["Pumpkins",1,[[37,45,"s"],[39,43,"p"]],"Field pumpkins are for carving. The small sugar and cheese pumpkins are the ones for pie."],

  /* --- ROOTS, TUBERS & ALLIUMS --- */
  ["Green garlic",2,[[14,21,"s"],[16,19,"p"]],"Immature garlic pulled as a thinning. The whole plant is edible, milder and greener than the cured bulb."],
  ["Spring onions & scallions",2,[[15,27,"s"],[17,23,"p"],[35,45,"s"]],"Continuous from mid-April. The fat ones with a real bulb are the April-to-June crop."],
  ["Radishes",2,[[14,24,"s"],[16,21,"p"],[35,46,"s"],[37,43,"p"]],"A cool-weather crop. Woody and hot by July, crisp again in September."],
  ["Hakurei turnips",2,[[15,24,"s"],[17,22,"p"],[36,47,"s"]],"Small, white, sweet enough to eat raw. The greens are worth cooking too."],
  ["Beets",2,[[21,30,"s"],[23,28,"p"],[36,48,"s"],[38,45,"p"],[49,52,"t"],[1,12,"t"]],"Bunched with their greens in summer, topped and cellared from November. Chioggia and golden alongside the red."],
  ["Carrots",2,[[22,30,"s"],[24,28,"p"],[36,48,"s"],[39,46,"p"],[49,52,"t"],[1,14,"t"]],"The autumn crop is a different vegetable from the summer one. Cold makes a carrot turn stored starch into sugar as antifreeze, so a root pulled after a hard frost comes up startlingly sweet — sweet enough that people who say they dislike carrots tend to like these. The ones that overwinter under straw and come up in March are sweeter still."],
  ["New potatoes",2,[[25,31,"s"],[26,29,"p"]],"Dug young, with the skins still rubbing off. They will not keep, so they are cheap."],
  ["Potatoes",2,[[28,44,"s"],[31,41,"p"],[45,52,"t"],[1,20,"t"]],"Main crop from August. Cellared stock stays local through winter and into April."],
  ["Sweet potatoes",2,[[36,43,"s"],[38,42,"p"],[44,52,"t"],[1,16,"t"]],"Dug in September, then cured warm and humid for a fortnight before they go anywhere. Curing is the step that turns starch to sugar: uncured, a sweet potato is bland and faintly waxy; cured, it is dessert. After that they keep until spring in an ordinary cupboard."],
  ["Fresh onions",2,[[25,33,"s"],[27,31,"p"]],"Thin-skinned summer onions, sold uncured. Sweet, juicy, soft within two weeks."],
  ["Storage onions",2,[[34,52,"t"],[1,14,"t"]],"Cured in August, then papery and reliable all winter."],
  ["Garlic",2,[[27,32,"s"],[28,30,"p"],[33,52,"t"],[1,12,"t"]],"Hardneck varieties, pulled in July and cured, then sold all winter."],
  ["Shallots",2,[[28,34,"s"],[29,32,"p"],[35,50,"t"]],"Lifted and cured with the garlic."],
  ["Leeks",2,[[36,52,"s"],[40,49,"p"],[1,9,"t"]],"They stand in frozen ground and get better for it. The backbone of a Philadelphia January."],
  ["Celeriac",2,[[38,48,"s"],[40,46,"p"],[49,52,"t"],[1,6,"t"]],"Knobbly and unpromising, and the best root in the market for soup. Keeps for months wrapped in the fridge."],
  ["Parsnips",2,[[40,52,"s"],[43,50,"p"],[1,13,"s"],[9,12,"p"]],"Dug after hard frost, never before it. A parsnip left in the ground all winter and lifted in March has spent months turning starch to sugar with nothing else to do, and it comes out sweeter than any fruit on this chart. March is the month for it."],
  ["Rutabaga",2,[[39,50,"s"],[41,47,"p"],[51,52,"t"],[1,6,"t"]],"Waxed for storage at the supermarket. Unwaxed and much better at market from October."],
  ["Daikon & watermelon radish",2,[[38,48,"s"],[40,45,"p"]],"Autumn radishes that grow large and stay mild. The watermelon ones are magenta all the way through."],
  ["Purple-top turnips",2,[[38,49,"s"],[40,46,"p"]],"The big storage turnip, sweeter after frost."],
  ["Sunchokes",2,[[40,52,"s"],[42,49,"p"],[1,14,"s"],[9,13,"p"]],"A native perennial, dug all winter whenever the ground gives. Nutty, and best roasted hard."],
  ["Horseradish",2,[[40,48,"s"],[10,15,"s"]],"Dug in autumn and again at the very start of spring. Grate it outdoors."],

  /* --- LEAFY GREENS & SALAD --- */
  ["Spinach",3,[[12,22,"s"],[14,19,"p"],[37,48,"s"],[39,45,"p"],[49,52,"t"],[1,11,"t"]],"Two different vegetables under one name. Spinach sown in autumn, left under a low tunnel through the cold and cut in March, is thick-leaved and close to sugary. The summer crop bolts the moment it turns hot and tastes of very little. If you have only had the second kind, the first will not seem like the same plant."],
  ["Arugula",3,[[14,25,"s"],[15,21,"p"],[35,48,"s"],[37,44,"p"]],"Peppery when it is cool and ferocious in the heat. September is when to bother."],
  ["Head & leaf lettuce",3,[[14,26,"s"],[16,23,"p"],[35,47,"s"],[37,44,"p"]],"Gone for six weeks in high summer, when it bolts and turns bitter. Back in September."],
  ["Mesclun & baby greens",3,[[13,27,"s"],[15,23,"p"],[34,48,"s"],[36,45,"p"],[49,52,"t"],[1,12,"t"]],"Cut-and-come-again mixes. Tunnel growers keep a thin supply going through most of the winter."],
  ["Pea shoots",3,[[12,23,"s"],[14,20,"p"],[36,46,"s"]],"Grown under cover, and one of the first green things at market, well before anything is in the field."],
  ["Sorrel",3,[[13,25,"s"],[15,21,"p"],[36,46,"s"]],"Lemon-sharp. Collapses in a hot pan."],
  ["Asian greens",3,[[14,24,"s"],[35,48,"s"],[37,44,"p"]],"Tatsoi, mizuna, komatsuna. Cold-hardy, so they run later into autumn than lettuce manages."],
  ["Bok choy",3,[[15,25,"s"],[36,47,"s"],[38,44,"p"]],"Baby heads in spring, full size in autumn."],
  ["Swiss chard",3,[[19,47,"s"],[24,42,"p"]],"The most forgiving green in this climate. Sow in May and cut from it until the ground freezes."],
  ["Kale",3,[[17,27,"s"],[19,24,"p"],[33,52,"s"],[40,50,"p"],[1,9,"t"]],"Kale cut after the first hard frost is sweet. Kale in September is fibrous. Wait."],
  ["Collards",3,[[20,27,"s"],[35,52,"s"],[41,50,"p"],[1,8,"t"]],"Frost-sweetened like kale, and better able to take a real freeze. Holds in the field into January."],
  ["Escarole & endive",3,[[20,27,"s"],[36,48,"s"],[39,45,"p"]],"The bitter chicories, and close to the heart of an Italian-Philadelphian kitchen. Escarole and beans is a city dish in the way a cheesesteak is a city dish, except that nobody argues about where to get it. Autumn heads are heavier and less aggressive than spring ones."],
  ["Radicchio & chicory",3,[[20,26,"s"],[37,48,"s"],[40,46,"p"]],"Autumn is the only serious season. Cold sets the colour and takes the edge off the bitterness."],
  ["Watercress",3,[[13,22,"s"],[15,20,"p"],[36,45,"s"]],"Spring-fed beds in the Brandywine watershed. It needs cold running water, so it vanishes in summer."],
  ["Dandelion & chicory greens",3,[[12,22,"s"],[13,18,"p"],[36,45,"s"]],"The first green at the 9th Street stalls, sometimes as early as March. Bitter on purpose."],

  /* --- BRASSICAS, STALKS & PODS --- */
  ["Asparagus",4,[[15,24,"s"],[17,21,"p"]],"The opening bell. Chester and Lancaster county beds get cut daily for about six weeks and then stop dead, because the crowns need the rest of the summer to build next year's spears. A bed takes three years to come into production and then runs for twenty, which is why asparagus growers are patient people and why the price never really falls."],
  ["Sugar snap & snow peas",4,[[19,27,"s"],[21,25,"p"]],"Sweet only while the nights stay cool. The first hot spell in late June finishes them."],
  ["Shell peas",4,[[20,26,"s"],[22,25,"p"]],"A pound in the pod gives about a cup shelled. That ratio is why almost nobody grows them commercially now."],
  ["Fava beans",4,[[20,26,"s"],[21,24,"p"]],"One short window in June."],
  ["Garlic scapes",4,[[20,24,"s"],[21,23,"p"]],"The flower stalk, snapped off so the bulb sizes up. Three weeks in June."],
  ["Kohlrabi",4,[[20,27,"s"],[38,47,"s"],[40,45,"p"]],"Peel it deeply and eat it raw and it is the crispest thing at the market. Autumn bulbs grow big without going woody."],
  ["Broccoli",4,[[21,28,"s"],[22,26,"p"],[36,46,"s"],[38,44,"p"]],"It hates heat, so it comes in two runs. The side shoots after the main head are the better part."],
  ["Broccoli rabe",4,[[15,24,"s"],[17,22,"p"],[36,49,"s"],[39,46,"p"]],"Philadelphia's own green. Roast pork, sharp provolone, rabe: the argument about this city's real sandwich ends there, whatever the tourists queue for. It is bitter and it is supposed to be, and blanching it first is how most people who think they dislike it find out they do not."],
  ["Cauliflower",4,[[22,27,"s"],[37,46,"s"],[39,44,"p"]],"Demanding and weather-sensitive. The autumn crop is much more reliable than the spring one."],
  ["Cabbage",4,[[22,29,"s"],[23,27,"p"],[36,48,"s"],[39,45,"p"],[49,52,"t"],[1,8,"t"]],"Summer heads are loose and mild. The dense autumn heads are the ones for kraut and long keeping."],
  ["Napa cabbage",4,[[22,27,"s"],[37,47,"s"],[39,44,"p"]],"Grown widely here for kimchi. Autumn is the real season."],
  ["Brussels sprouts",4,[[40,52,"s"],[43,50,"p"],[1,6,"t"]],"Sold on the stalk from late October. Every hard frost improves them."],
  ["Fennel",4,[[20,27,"s"],[37,47,"s"],[39,44,"p"]],"Bolts in heat, so the autumn bulbs are fatter and sweeter. The fronds are worth keeping."],
  ["Celery",4,[[30,42,"s"],[32,39,"p"]],"Local celery is short, dark green and strongly flavoured, closer to a herb than to the pale supermarket kind."],
  ["Cardoons",4,[[38,46,"s"],[40,44,"p"]],"Thistle stalks, blanched and braised. A 9th Street tradition, autumn only, and you have to look for them."],

  /* --- HERBS & AROMATICS --- */
  ["Chives",5,[[13,44,"s"],[15,25,"p"]],"Up before almost anything else. The purple blossoms in May are edible and make a good vinegar."],
  ["Mint",5,[[17,42,"s"],[20,36,"p"]],"Perennial and invasive."],
  ["Cilantro",5,[[16,26,"s"],[17,23,"p"],[36,46,"s"],[38,44,"p"]],"Bolts the moment it turns hot, so it is a spring and autumn herb. The coriander seed comes in between."],
  ["Dill",5,[[20,40,"s"],[24,34,"p"]],"Growers time it to land with the pickling cucumbers in July. Heads and fronds both."],
  ["Parsley",5,[[18,48,"s"],[22,42,"p"]],"Flat-leaf, hardy well past frost, and often the last green thing standing in a November field."],
  ["Basil",5,[[24,40,"s"],[27,37,"p"]],"Killed outright by the first cold night, and it does not take a frost to do it: forty degrees is enough. This is the one crop on the chart with a hard stop rather than a tapering off, which is why the pesto gets made in the week before the forecast turns and not the week after."],
  ["Thyme, sage & oregano",5,[[16,48,"s"],[20,42,"p"]],"Woody perennials, cut from spring to hard frost. Sage will often go straight through winter."],
  ["Rosemary",5,[[16,48,"s"],[20,42,"p"]],"Marginally hardy here. A sheltered South Philly wall will carry a plant through most winters."],
  ["Tarragon",5,[[17,40,"s"],[20,34,"p"]],"French tarragon only. The Russian sort looks identical and tastes of nothing."],
  ["Shiso",5,[[26,38,"s"],[28,35,"p"]],"Grown for the city's Japanese and Korean kitchens. It self-seeds freely once you have it."],
  ["Lovage",5,[[15,30,"s"],[17,26,"p"]],"Like concentrated celery, and up very early."],

  /* --- MUSHROOMS & FORAGED --- */
  ["Cultivated mushrooms",6,[[1,52,"s"],[1,52,"p"]],"Kennett Square, forty-five minutes west, grows something like half the mushrooms in the United States, in windowless cinder-block houses on composted straw. It is the one thing on this chart available locally in all fifty-two weeks, and the only entry with no season at all. The industry started there in the 1890s and the town has been at it ever since."],
  ["Ramps",6,[[14,18,"s"],[15,17,"p"]],"Wild leeks off the wooded slopes. A ramp takes upwards of five years to reach picking size and does not spread quickly, so a patch dug out for its bulbs will not come back on any useful timescale. Taking a leaf and leaving the plant costs nothing and is the reason there are still any."],
  ["Fiddlehead ferns",6,[[15,19,"s"],[16,18,"p"]],"Ostrich fern only, and they have to be cooked through. Two or three weeks along the creek bottoms."],
  ["Stinging nettles",6,[[13,20,"s"],[14,17,"p"]],"Free, everywhere. Heat destroys the sting."],
  ["Garlic mustard",6,[[12,19,"s"],[13,17,"p"]],"An aggressive invasive with a fine pungent green. Foraging it is a public service."],
  ["Morels",6,[[16,20,"s"],[17,19,"p"]],"Late April into May, around dying elms and old orchards. Never cheap, never around long."],
  ["Chanterelles",6,[[27,36,"s"],[29,34,"p"]],"Midsummer, in oak woods, a few days after a soaking rain. Apricot-scented, and unmistakable once you have smelled one."],
  ["Chicken of the woods",6,[[34,44,"s"],[36,41,"p"]],"A bright orange bracket on oak. Only the young outer edges are worth taking."],
  ["Maitake",6,[[37,44,"s"],[38,42,"p"]],"Hen of the woods, at the foot of old oaks. The same tree fruits year after year."],
  ["Black walnuts",6,[[39,44,"s"],[40,43,"p"]],"All over the city's parks. Enormous work to hull and crack, and a flavour nothing else has."],
  ["Elderflower",6,[[22,25,"s"],[23,24,"p"]],"Two weeks in early June. Heads cut on a dry morning carry the perfume; wet ones taste green."],

  /* --- FROM THE WATER --- */
  ["Shad & shad roe",7,[[13,20,"s"],[15,18,"p"]],"For two centuries this was the fish that fed Philadelphia. Shad run up the Delaware every spring to spawn, and the city was built partly on catching them; the story that the run saved Washington's army at Valley Forge gets repeated everywhere and is probably not true. Dams and pollution came close to ending it. The run is a fraction of what it was, but the roe still turns up in April."],
  ["Blue crab",7,[[17,47,"s"],[27,40,"p"]],"Heaviest and fattest in late summer, just before they move out to deep water. Delaware and Chesapeake bays both."],
  ["Soft-shell crab",7,[[20,33,"s"],[22,29,"p"]],"Crabs taken in the hours after moulting, before the new shell sets. The first big run follows the May full moon."],
  ["Striped bass",7,[[14,23,"s"],[16,21,"p"],[36,48,"s"],[40,46,"p"]],"Two runs past the coast, spring and autumn. Regulations change year to year and supply moves with them."],
  ["Fluke",7,[[19,37,"s"],[24,33,"p"]],"Summer flounder, off the Jersey inshore grounds. The default local white fish."],
  ["Bluefish",7,[[20,44,"s"],[26,38,"p"]],"Oily, cheap, very good within a day of landing and unpleasant after that. Its reputation comes entirely from the second case."],
  ["Weakfish",7,[[18,25,"s"],[36,42,"s"],[38,41,"p"]],"Sea trout. Soft-fleshed, and it has to be cooked the day it lands."],
  ["Delaware Bay oysters",7,[[36,52,"s"],[40,50,"p"],[1,17,"s"],[1,12,"p"]],"The old rule about months with an R in them still tracks the wild season reasonably well, since it is really a rule about spawning and warm water rather than about safety. Farmed stock is good year-round now. The bay's beds were nearly wiped out twice, by disease in the 1950s and again in the 1990s, and the recovery is recent enough that people still talk about it."],
  ["Cape May scallops",7,[[1,52,"s"],[40,52,"p"],[1,10,"p"]],"Cape May is one of the largest scallop ports on the East Coast. Dry-packed day-boat scallops cost more and are worth it."],
  ["Hard clams",7,[[1,52,"s"],[22,40,"p"]],"Littlenecks and cherrystones, dug all year."],
  ["Atlantic mackerel",7,[[40,52,"s"],[45,52,"p"],[1,14,"s"],[1,8,"p"]],"A cold-water winter fish, arriving when almost nothing green is left."],
  ["Monkfish",7,[[44,52,"s"],[47,52,"p"],[1,14,"s"],[1,9,"p"]],"Winter landings out of Cape May and Barnegat Light. Tails only, and better than they look."]
  ]
};
