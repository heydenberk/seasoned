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
  ["Rhubarb",0,[[15,25,"s"],[17,21,"p"]],"Lancaster County field stalks, and the first thing all year that behaves like fruit. It tastes nothing like fruit; the sugar is your problem. Forced crowns turn up a fortnight before the field crop and cost accordingly."],
  ["Strawberries",0,[[20,26,"s"],[22,24,"p"]],"Chester County and South Jersey. The local season runs about four weeks and then stops, which seems to surprise people every year — the flats stacked up at every corner store in July came from California, picked hard and trucked. A local berry is soft, dark red the whole way through, and won't survive a second day in the fridge."],
  ["Sweet cherries",0,[[24,27,"s"],[25,26,"p"]],"Weather-fragile. A hard rain at colour split can end the crop in a day."],
  ["Sour cherries",0,[[25,28,"s"],[26,27,"p"]],"Montmorency, too sharp to eat raw. They cost less and make the better pie."],
  ["Blueberries",0,[[25,33,"s"],[27,31,"p"]],"Hammonton calls itself the blueberry capital of the world, which was a better claim a century ago than it is now — New Jersey sits well down the national table these days. The town is forty minutes from Center City, and the cultivated highbush blueberry was bred a short drive away at Whitesbog, by Elizabeth Coleman White, in the 1910s."],
  ["Black raspberries",0,[[25,28,"s"],[26,27,"p"]],"Two weeks, maybe three. The wild canes along the Wissahickon come in at the same time."],
  ["Red raspberries",0,[[25,29,"s"],[26,28,"p"],[34,42,"s"],[36,40,"p"]],"Two crops. A summer flush on last year's canes, then a longer autumn run on this year's growth that goes right up to frost and is the better of the two. The autumn fruit is what the everbearing varieties are for."],
  ["Blackberries",0,[[28,35,"s"],[29,33,"p"]],"Thornless cultivars from late July. Hedgerow brambles run a fortnight behind."],
  ["Currants & gooseberries",0,[[25,29,"s"],[26,28,"p"]],"Rare here. A few growers keep them going."],
  ["Apricots",0,[[27,30,"s"],[28,29,"p"]],"Late frost takes the crop one year in three."],
  ["Peaches",0,[[28,37,"s"],[30,35,"p"]],"Jersey fruit, and Adams County over in Pennsylvania. Yellow varieties come first. Whites arrive from mid-August, and the last freestones of the run, once the nights have started cooling, are the best of the year."],
  ["Nectarines",0,[[29,36,"s"],[31,34,"p"]],"Same orchards as the peaches, a week behind."],
  ["Plums",0,[[31,38,"s"],[32,36,"p"]],"Japanese types first, then Italian prune plums in September. Those are the ones for roasting."],
  ["Cantaloupe & muskmelon",0,[[30,37,"s"],[31,35,"p"]],"Jersey sand soil grows a very good melon. The stem end is where the smell is."],
  ["Watermelon",0,[[31,37,"s"],[32,36,"p"]],"Local fruit lands long after the supermarket started selling southern melons."],
  ["Elderberries",0,[[32,37,"s"],[33,35,"p"]],"Hedgerow and small-farm fruit, almost always cooked. The flowers come six weeks before."],
  ["Figs",0,[[33,41,"s"],[35,39,"p"]],"A South Philly institution. The trees are marginal this far north, so every autumn they get wrapped in tarpaper and old carpet and whatever else is to hand, then bent over or buried, then uncovered in spring. Walk the alleys off Passyunk in late August and there is fruit. The practice arrived with Italian families and has since been taken up by Southeast Asian ones."],
  ["Apples",0,[[32,46,"s"],[36,43,"p"],[47,52,"t"],[1,18,"t"]],"Ginger Gold and the early Galas turn up in August, thin and mostly for cooking. The season's real work is done by the keepers: Goldrush and Winesap go into cold storage in October and come out in March still worth eating. Storage runs out in early May, and then there's no local apple until August."],
  ["Pears",0,[[33,43,"s"],[35,40,"p"],[44,50,"t"]],"Pears ripen off the tree rather than on it, so they arrive hard and stay that way on the shelf. Bartlett first, then Bosc and Comice into October. Give them a few days in a paper bag and press the neck, not the belly, to tell when they've come round."],
  ["Asian pears",0,[[35,42,"s"],[36,40,"p"]],"Unlike the European sort these do ripen on the tree, and they hold for months cold."],
  ["Grapes",0,[[35,42,"s"],[36,40,"p"]],"Concord and Niagara. Slip-skin, heavily perfumed, not much like a table grape."],
  ["Pawpaw",0,[[34,40,"s"],[36,38,"p"]],"The largest fruit native to North America: custardy, somewhere between a mango and a banana. It bruises in two days and won't ship, so it never made it into commercial agriculture despite growing wild across the entire eastern half of the country. Pennsylvania has a small but serious pawpaw scene."],
  ["Persimmons",0,[[40,47,"s"],[42,45,"p"]],"Asian varieties at market, and the astringent ones want to be jelly-soft before they're worth anything. The wild American persimmons grow along field edges all over the region and stay inedible until after a hard frost, which is most of the reason nobody sells them."],
  ["Quince",0,[[40,46,"s"],[41,44,"p"]],"Inedible raw, very good cooked. A few old orchards in Bucks and Chester counties still have trees."],
  ["Cranberries",0,[[40,47,"s"],[41,45,"p"]],"The Pine Barrens bogs are one of only four places in the country growing them commercially. They freeze without any loss."],

  /* --- FRUITING & VINE --- */
  ["Zucchini & summer squash",1,[[24,38,"s"],[26,34,"p"]],"Arrives in June and then will not stop. By August the grower is trying to give it away."],
  ["Squash blossoms",1,[[25,33,"s"],[26,31,"p"]],"Male flowers, cut at dawn, sold the same morning. They last a day."],
  ["Cucumbers",1,[[25,37,"s"],[27,34,"p"]],"Slicers from late June. The small Kirbys for pickling peak in the back half of July."],
  ["Green beans",1,[[25,38,"s"],[27,35,"p"]],"Successive sowings give a long run. Dragon tongue and haricots verts come from the smaller growers."],
  ["Field tomatoes",1,[[29,41,"s"],[31,38,"p"]],"The whole point of the year, and the reason the last week of July matters more here than any other. Jersey field fruit wants heat in the soil and a warm night, so anything appearing much before then was grown under glass and tastes like it. Expect six weeks of good fruit and then a long tapering off."],
  ["Cherry tomatoes",1,[[27,41,"s"],[29,38,"p"]],"A fortnight ahead of the big ones, and they run later into the cool nights."],
  ["Heirloom tomatoes",1,[[30,39,"s"],[31,37,"p"]],"Brandywine is the one everybody plants. The usual account has a gardener in Ohio sending seed to Johnson & Stokes, a Philadelphia seed house, which trialled it as Number 45 and put it in the 1889 catalogue; whether the name is the Chester County creek is asserted more often than it's documented. Expect cracking and a low yield. Both are normal."],
  ["Tomatillos",1,[[30,39,"s"],[31,36,"p"]],"Grown seriously here now for the city's Mexican kitchens. The husks should be tight and papery and the fruit should fill them; if it rattles it was picked early."],
  ["Sweet corn",1,[[27,38,"s"],[30,35,"p"]],"Bicolour and white supersweets, mostly, and they hold their sugar for days — the old rule about putting the water on before you walk out to pick belongs to the sugary varieties, not to what most growers plant now. The first fortnight of August is still the top of it."],
  ["Sweet peppers",1,[[29,41,"s"],[31,38,"p"]],"Green all summer. The ripe red, yellow and chocolate ones cost about twice as much and arrive in September."],
  ["Hot peppers",1,[[30,41,"s"],[32,38,"p"]],"Long hots for frying are the local staple. Habaneros and the slow-ripening chillies turn up in September."],
  ["Eggplant",1,[[29,40,"s"],[31,37,"p"]],"Globe, Italian and the slim Asian types. Heavy for its size means fewer seeds."],
  ["Okra",1,[[30,39,"s"],[32,36,"p"]],"It likes the humidity here. Over four inches long and they turn to rope."],
  ["Lima beans",1,[[30,38,"s"],[32,36,"p"]],"Fresh shelling limas bear no relation to the frozen ones. Sold in the pod, usually by the quart."],
  ["Edamame",1,[[30,37,"s"],[31,35,"p"]],"A few growers sell it still on the stalk."],
  ["Winter squash",1,[[35,48,"s"],[37,44,"p"],[49,52,"t"],[1,8,"t"]],"Delicata and acorn come first and neither keeps; eat them in October. Butternut, kabocha and hubbard hold in a cool room until spring, and improve for the first month or two while the starch converts."],
  ["Pumpkins",1,[[37,45,"s"],[39,43,"p"]],"Field pumpkins are for carving. The small sugar and cheese pumpkins are the ones for pie."],

  /* --- ROOTS, TUBERS & ALLIUMS --- */
  ["Green garlic",2,[[14,21,"s"],[16,19,"p"]],"Immature garlic pulled as a thinning. The whole plant is edible, milder and greener than the cured bulb, and it turns up weeks before anything else in the allium row."],
  ["Spring onions & scallions",2,[[15,27,"s"],[17,23,"p"],[35,45,"s"]],"Continuous from mid-April. The fat ones with a real bulb are the April-to-June crop."],
  ["Radishes",2,[[14,24,"s"],[16,21,"p"],[35,46,"s"],[37,43,"p"]],"A cool-weather crop. Woody and hot by July, crisp again in September."],
  ["Hakurei turnips",2,[[15,24,"s"],[17,22,"p"],[36,47,"s"]],"Small, white, sweet enough to eat raw. The greens are worth cooking too."],
  ["Beets",2,[[21,30,"s"],[23,28,"p"],[36,48,"s"],[38,45,"p"],[49,52,"t"],[1,12,"t"]],"Bunched with their greens in summer, topped and cellared from November. Chioggia and golden alongside the red, and the golden ones don't bleed. The greens are chard by another name and get thrown away far more often than they should be."],
  ["Carrots",2,[[22,30,"s"],[24,28,"p"],[36,48,"s"],[39,46,"p"],[49,52,"t"],[1,14,"t"]],"The autumn crop is a different vegetable from the summer one. Cold makes a carrot turn stored starch into sugar as antifreeze, so a root pulled after a hard frost comes up startlingly sweet — sweet enough that people who say they dislike carrots tend to like these. The ones that overwinter under straw and come up in March are sweeter still."],
  ["New potatoes",2,[[25,31,"s"],[26,29,"p"]],"Dug young, with the skins still rubbing off. They won't keep, which is why they're cheap in July and gone by August. Waxy enough to hold together in a salad."],
  ["Potatoes",2,[[28,44,"s"],[31,41,"p"],[45,52,"t"],[1,20,"t"]],"Main crop from August. Cellared stock stays local through winter and into April."],
  ["Sweet potatoes",2,[[36,43,"s"],[38,42,"p"],[44,52,"t"],[1,16,"t"]],"Dug in September, then cured warm and humid for a fortnight before they go anywhere. Curing is the step that turns starch to sugar: uncured, a sweet potato is bland and faintly waxy; cured, it is dessert. After that they keep until spring in an ordinary cupboard."],
  ["Fresh onions",2,[[25,33,"s"],[27,31,"p"]],"Thin-skinned summer onions, sold uncured. Sweet, juicy, soft within two weeks. They're a different proposition from the cured ones and shouldn't be bought in quantity."],
  ["Storage onions",2,[[34,52,"t"],[1,14,"t"]],"Cured in August, then papery and reliable all winter."],
  ["Garlic",2,[[27,32,"s"],[28,30,"p"],[33,52,"t"],[1,12,"t"]],"Hardneck varieties, pulled in July and cured, then sold all winter. Softneck keeps longer but won't take the cold as well, so most of what's grown around here is hardneck."],
  ["Shallots",2,[[28,34,"s"],[29,32,"p"],[35,50,"t"]],"Lifted and cured with the garlic, and they keep nearly as long."],
  ["Leeks",2,[[36,52,"s"],[40,49,"p"],[1,9,"t"]],"They stand in frozen ground and get better for it. The backbone of a Philadelphia January."],
  ["Celeriac",2,[[38,48,"s"],[40,46,"p"],[49,52,"t"],[1,6,"t"]],"Knobbly and unpromising, and the best root in the market for soup. Keeps for months wrapped in the fridge. Peel it hard — the outer half-inch is where all the fibre is — and expect to lose a third of what you paid for."],
  ["Parsnips",2,[[40,52,"s"],[43,50,"p"],[1,13,"s"],[9,12,"p"]],"Dug after hard frost. A parsnip left in the ground all winter and lifted in March has spent months turning starch to sugar with nothing else to do, and comes up sweeter than anything else still in the ground. March is the month for it."],
  ["Rutabaga",2,[[39,50,"s"],[41,47,"p"],[51,52,"t"],[1,6,"t"]],"Waxed for storage at the supermarket. Unwaxed and much better at market from October."],
  ["Daikon & watermelon radish",2,[[38,48,"s"],[40,45,"p"]],"Autumn radishes that grow large and stay mild. The watermelon ones are magenta all the way through."],
  ["Purple-top turnips",2,[[38,49,"s"],[40,46,"p"]],"The big storage turnip, sweeter after frost."],
  ["Sunchokes",2,[[40,52,"s"],[42,49,"p"],[1,14,"s"],[9,13,"p"]],"A native perennial, dug all winter whenever the ground gives. Nutty, and best roasted hard."],
  ["Horseradish",2,[[40,48,"s"],[10,15,"s"]],"Dug in autumn and again at the very start of spring. Grate it outdoors."],

  /* --- LEAFY GREENS & SALAD --- */
  ["Spinach",3,[[12,22,"s"],[14,19,"p"],[37,48,"s"],[39,45,"p"],[49,52,"t"],[1,11,"t"]],"Two different vegetables under one name. Sown in autumn, left under a low tunnel through the cold and cut in March, it's thick-leaved and close to sugary. Sown in spring it bolts the moment the heat arrives and tastes of very little."],
  ["Arugula",3,[[14,25,"s"],[15,21,"p"],[35,48,"s"],[37,44,"p"]],"Peppery when it is cool and ferocious in the heat. September is when to bother."],
  ["Head & leaf lettuce",3,[[14,26,"s"],[16,23,"p"],[35,47,"s"],[37,44,"p"]],"Gone for six weeks in high summer, when it bolts and turns bitter. Back in September."],
  ["Mesclun & baby greens",3,[[13,27,"s"],[15,23,"p"],[34,48,"s"],[36,45,"p"],[49,52,"t"],[1,12,"t"]],"Cut-and-come-again mixes. Tunnel growers keep a thin supply going through most of the winter."],
  ["Pea shoots",3,[[12,23,"s"],[14,20,"p"],[36,46,"s"]],"Grown under cover, and one of the first green things at market, well before anything is in the field."],
  ["Sorrel",3,[[13,25,"s"],[15,21,"p"],[36,46,"s"]],"Lemon-sharp, and a perennial, so it's among the first things to wake up. Collapses in a hot pan."],
  ["Asian greens",3,[[14,24,"s"],[35,48,"s"],[37,44,"p"]],"Tatsoi, mizuna, komatsuna. Cold-hardy, so they run later into autumn than lettuce manages."],
  ["Bok choy",3,[[15,25,"s"],[36,47,"s"],[38,44,"p"]],"Baby heads in spring, full size in autumn. Grown heavily for the city's Asian markets."],
  ["Swiss chard",3,[[19,47,"s"],[24,42,"p"]],"The most forgiving green in this climate. Sow in May and cut from it until the ground freezes, and it will keep making leaves the whole time without bolting or turning bitter."],
  ["Kale",3,[[17,27,"s"],[19,24,"p"],[33,52,"s"],[40,50,"p"],[1,9,"t"]],"Kale cut after the first hard frost is sweet. Kale in September is fibrous. Wait."],
  ["Collards",3,[[20,27,"s"],[35,52,"s"],[41,50,"p"],[1,8,"t"]],"Frost-sweetened like kale, and better able to take a real freeze. Holds in the field into January, which makes it the last thing standing in a lot of local plots."],
  ["Escarole & endive",3,[[20,27,"s"],[36,48,"s"],[39,45,"p"]],"The bitter chicories, and the heart of an Italian-Philadelphian kitchen. Escarole and beans is a city dish in the way a cheesesteak is a city dish, except that nobody argues about where to get it. Autumn heads are heavier and less aggressive than spring ones."],
  ["Radicchio & chicory",3,[[20,26,"s"],[37,48,"s"],[40,46,"p"]],"Autumn is the only serious season. Cold sets the colour and takes the edge off the bitterness."],
  ["Watercress",3,[[13,22,"s"],[15,20,"p"],[36,45,"s"]],"Spring-fed beds in the Brandywine watershed, which is the only reason it grows here commercially at all — it needs cold water moving over it constantly, so it vanishes the moment the streams warm up in summer and comes back in the autumn."],
  ["Dandelion & chicory greens",3,[[12,22,"s"],[13,18,"p"],[36,45,"s"]],"The first green at the 9th Street stalls, sometimes as early as March. Bitter on purpose."],

  /* --- BRASSICAS, STALKS & PODS --- */
  ["Asparagus",4,[[15,24,"s"],[17,21,"p"]],"The opening bell. Chester and Lancaster county beds get cut daily for six or seven weeks and then stop dead, because the crowns need the rest of the summer to build next year's spears. A bed takes three years before it can be cut properly and then produces for fifteen years or more, which is a long commitment for a vegetable."],
  ["Sugar snap & snow peas",4,[[19,27,"s"],[21,25,"p"]],"Sweet only while the nights stay cool. The first hot spell in late June finishes them."],
  ["Shell peas",4,[[20,26,"s"],[22,25,"p"]],"A pound in the pod gives about a cup shelled. That ratio is why almost nobody grows them commercially now."],
  ["Fava beans",4,[[20,26,"s"],[21,24,"p"]],"One short window in June. Double-podding is tedious and worth it."],
  ["Garlic scapes",4,[[20,24,"s"],[21,23,"p"]],"The flower stalk, snapped off so the bulb sizes up. Three weeks in June."],
  ["Kohlrabi",4,[[20,27,"s"],[38,47,"s"],[40,45,"p"]],"Peel it deeply and eat it raw and it's the crispest thing at the market. Autumn bulbs grow big without going woody, which is the opposite of how most brassica stems behave."],
  ["Broccoli",4,[[21,28,"s"],[22,26,"p"],[36,46,"s"],[38,44,"p"]],"It hates heat, so it comes in two runs. The side shoots after the main head are the better part."],
  ["Broccoli rabe",4,[[15,24,"s"],[17,22,"p"],[36,49,"s"],[39,46,"p"]],"Philadelphia's own green. Roast pork, sharp provolone, rabe: that's where the argument about this city's real sandwich ends, whatever the lines outside the cheesesteak places suggest. It's bitter and it's supposed to be. Blanching it first is how most people who think they dislike it find out they don't."],
  ["Cauliflower",4,[[22,27,"s"],[37,46,"s"],[39,44,"p"]],"Demanding and weather-sensitive. The autumn crop is much more reliable than the spring one."],
  ["Cabbage",4,[[22,29,"s"],[23,27,"p"],[36,48,"s"],[39,45,"p"],[49,52,"t"],[1,8,"t"]],"Summer heads are loose and mild. The dense autumn heads are the ones for kraut and long keeping."],
  ["Napa cabbage",4,[[22,27,"s"],[37,47,"s"],[39,44,"p"]],"Grown widely here for kimchi. Autumn is the real season."],
  ["Brussels sprouts",4,[[40,52,"s"],[43,50,"p"],[1,6,"t"]],"Sold on the stalk from late October. Every hard frost improves them."],
  ["Fennel",4,[[20,27,"s"],[37,47,"s"],[39,44,"p"]],"Bolts in heat, so the autumn bulbs are fatter and sweeter. The fronds are worth keeping."],
  ["Celery",4,[[30,42,"s"],[32,39,"p"]],"Local celery is short, dark green and strongly flavoured, closer to a herb than to the pale supermarket kind. It's grown for stock and soffritto rather than for eating raw with a dip, and it holds its flavour through a long braise instead of disappearing."],
  ["Cardoons",4,[[38,46,"s"],[40,44,"p"]],"Thistle stalks, blanched and braised, and a 9th Street tradition rather than a supermarket item. Autumn only, and you have to look for them. The work is in stripping the strings and the reward is something between an artichoke and celery."],

  /* --- HERBS & AROMATICS --- */
  ["Chives",5,[[13,44,"s"],[15,25,"p"]],"Up before almost anything else. The purple blossoms in May are edible and make a good vinegar."],
  ["Mint",5,[[17,42,"s"],[20,36,"p"]],"Perennial and invasive."],
  ["Cilantro",5,[[16,26,"s"],[17,23,"p"],[36,46,"s"],[38,44,"p"]],"Bolts the moment it turns hot, so it is a spring and autumn herb. The coriander seed comes in between."],
  ["Dill",5,[[20,40,"s"],[24,34,"p"]],"Growers time it to land with the pickling cucumbers in July. Heads and fronds both."],
  ["Parsley",5,[[18,48,"s"],[22,42,"p"]],"Flat-leaf, hardy well past frost, and often the last green thing standing in a November field."],
  ["Basil",5,[[24,40,"s"],[27,37,"p"]],"Dead on the first cold night, and it doesn't take a frost: forty degrees will do it. Almost everything else on this chart tapers off. Basil stops, so the pesto gets made in the week before the forecast turns and not the week after."],
  ["Thyme, sage & oregano",5,[[16,48,"s"],[20,42,"p"]],"Woody perennials, cut from spring to hard frost. Sage will often go straight through winter."],
  ["Rosemary",5,[[16,48,"s"],[20,42,"p"]],"Marginally hardy here. A sheltered South Philly wall will carry a plant through most winters."],
  ["Tarragon",5,[[17,40,"s"],[20,34,"p"]],"French tarragon only. The Russian sort looks identical and tastes of nothing."],
  ["Shiso",5,[[26,38,"s"],[28,35,"p"]],"Grown for the city's Japanese and Korean kitchens. It self-seeds freely once you have it."],
  ["Lovage",5,[[15,30,"s"],[17,26,"p"]],"An old kitchen-garden perennial, up very early. Tastes like concentrated celery."],

  /* --- MUSHROOMS & FORAGED --- */
  ["Cultivated mushrooms",6,[[1,52,"s"],[1,52,"p"]],"Kennett Square, forty-five minutes southwest, grows something like half the mushrooms in the United States, in windowless cinder-block houses on composted straw. It's the only entry here with no season at all — not merely sold year-round, which clams and scallops manage too, but at peak in every week of the year. William Swayne started growing them under his carnation benches in 1885 and the industry never left."],
  ["Ramps",6,[[14,18,"s"],[15,17,"p"]],"Wild leeks off the wooded slopes. A ramp takes upwards of five years to reach picking size and does not spread quickly, so a patch dug out for its bulbs will not come back on any useful timescale. Taking a leaf and leaving the plant costs nothing and is the reason there are still any."],
  ["Fiddlehead ferns",6,[[15,19,"s"],[16,18,"p"]],"Ostrich fern only, and they have to be cooked through. Two or three weeks along the creek bottoms."],
  ["Stinging nettles",6,[[13,20,"s"],[14,17,"p"]],"Free, everywhere. Heat destroys the sting."],
  ["Garlic mustard",6,[[12,19,"s"],[13,17,"p"]],"An aggressive invasive with a fine pungent green. Foraging it is a public service."],
  ["Morels",6,[[16,20,"s"],[17,19,"p"]],"Late April into May, around dying elms and old orchards. Never cheap, never around long. The people who know where they are do not tell anyone, which is the whole culture of the thing."],
  ["Chanterelles",6,[[27,36,"s"],[29,34,"p"]],"Midsummer, in oak woods, a few days after a soaking rain. Apricot-scented, and unmistakable once you've smelled one. They come back to the same ground year after year if nobody rakes it."],
  ["Chicken of the woods",6,[[34,44,"s"],[36,41,"p"]],"A bright orange bracket on oak. Only the young outer edges are worth taking."],
  ["Maitake",6,[[37,44,"s"],[38,42,"p"]],"Hen of the woods, at the foot of old oaks. The same tree fruits year after year."],
  ["Black walnuts",6,[[39,44,"s"],[40,43,"p"]],"All over the city's parks. Enormous work to hull and crack, and a flavour nothing else has."],
  ["Elderflower",6,[[22,25,"s"],[23,24,"p"]],"Two weeks in early June. Heads cut on a dry morning carry the perfume; wet ones taste green."],

  /* --- FROM THE WATER --- */
  ["Shad & shad roe",7,[[13,20,"s"],[15,18,"p"]],"For two centuries this was the fish that fed Philadelphia. Shad run up the Delaware every spring to spawn, and the city was built partly on catching them; the story that the run saved Washington's army at Valley Forge gets repeated everywhere and is probably not true. Dams and pollution came close to ending it. The run is a fraction of what it was, but the roe still turns up in April."],
  ["Blue crab",7,[[17,47,"s"],[27,40,"p"]],"Heaviest and fattest in late summer, just before they move out to deep water for the winter. Delaware and Chesapeake bays both, and the Delaware fishery is much the smaller of the two."],
  ["Soft-shell crab",7,[[20,33,"s"],[22,29,"p"]],"Crabs taken in the hours after moulting, before the new shell hardens. The first big run follows the May full moon, and the season is really a sequence of short runs rather than one continuous supply. Sold live if the fishmonger is any good."],
  ["Striped bass",7,[[14,23,"s"],[16,21,"p"],[36,48,"s"],[40,46,"p"]],"Two runs past the coast, spring and autumn. Regulations change year to year and supply moves with them, so a fishmonger who had it last April may not this April."],
  ["Fluke",7,[[19,37,"s"],[24,33,"p"]],"Summer flounder, off the Jersey inshore grounds. The default local white fish."],
  ["Bluefish",7,[[20,44,"s"],[26,38,"p"]],"Oily, cheap, very good within a day of landing and unpleasant after that. Its reputation comes entirely from the second case. Bleed it on the boat and the difference is enormous."],
  ["Weakfish",7,[[18,25,"s"],[36,42,"s"],[38,41,"p"]],"Sea trout. Soft-fleshed, and it has to be cooked the day it lands."],
  ["Delaware Bay oysters",7,[[36,52,"s"],[40,50,"p"],[1,17,"s"],[1,12,"p"]],"The old rule about months with an R in them still tracks the wild season reasonably well, since it is really a rule about spawning and warm water rather than about safety. Farmed stock is good year-round now. The bay's beds were nearly wiped out twice, by disease in the 1950s and again in the 1990s, and the recovery is recent enough that people still talk about it."],
  ["Cape May scallops",7,[[1,52,"s"],[40,52,"p"],[1,10,"p"]],"Cape May is one of the largest scallop ports on the East Coast. Dry-packed day-boat scallops cost more and are worth it; the wet-packed ones are soaked in phosphate, weigh more than they should and won't brown."],
  ["Hard clams",7,[[1,52,"s"],[22,40,"p"]],"Littlenecks and cherrystones out of Barnegat and Delaware bays, dug all year."],
  ["Atlantic mackerel",7,[[40,52,"s"],[45,52,"p"],[1,14,"s"],[1,8,"p"]],"A cold-water winter fish, arriving when almost nothing green is left."],
  ["Monkfish",7,[[44,52,"s"],[47,52,"p"],[1,14,"s"],[1,9,"p"]],"Winter landings out of Cape May and Barnegat Light. Tails only, and better than they look."]
  ],

  /* Dishes are ranked by how *briefly* they are possible, not by how many
     ingredients happen to be around. `needs` gates the dish and is satisfied
     from storage; `nice` only sharpens the ranking. */
  dishes: [

    /* --- the lean weeks --- */
    { name: "Mushroom toast",
      note: "Cream, far more black pepper than seems reasonable, and better bread than it sounds like it needs.",
      needs: ["Cultivated mushrooms"],
      nice: ["Thyme, sage & oregano", "Parsley"] },

    { name: "Clams in their own liquor",
      note: "Wine, and bread to get the bottom of the pan.",
      needs: ["Hard clams"],
      nice: ["Parsley", "Garlic"] },

    { name: "Scallops seared hard",
      note: "Dry-packed only. The wet ones are soaked in phosphate, give up their water in the pan and steam instead of browning, and no amount of heat will fix it.",
      needs: ["Cape May scallops"],
      nice: ["Parsley"] },

    { name: "Oysters on the half shell",
      note: "Cold, raw, and not much else.",
      needs: ["Delaware Bay oysters"],
      nice: ["Horseradish"] },

    { name: "Monkfish braised with onions",
      note: "The tail takes a long braise the way no other local white fish does — it holds together where fluke would fall apart. Worth knowing in February, when the alternatives are frozen.",
      needs: ["Monkfish", "Storage onions"],
      nice: ["Parsley", "Thyme, sage & oregano"] },

    { name: "Mackerel, grilled",
      note: "Oily enough to need nothing but salt and heat. Eat it the day you buy it.",
      needs: ["Atlantic mackerel"] },

    { name: "Potato and leek soup",
      note: "The whole argument for leeks standing in frozen ground.",
      needs: ["Potatoes", "Leeks"],
      nice: ["Parsley", "Thyme, sage & oregano"] },

    { name: "Roast root tray",
      note: "Carrots and parsnips together, hot oven, no crowding. After a hard frost both have converted enough starch to sugar that they caramelise on their own, and anything you add in the way of honey or syrup is working against them.",
      needs: ["Carrots", "Parsnips"],
      nice: ["Thyme, sage & oregano", "Storage onions"] },

    { name: "Celeriac remoulade",
      note: "Raw, matchsticked, mustard and mayonnaise. It keeps for months, so this is a January salad.",
      needs: ["Celeriac"] },

    { name: "Sunchoke soup",
      note: "Nutty and faintly sweet. Roast them first or it tastes of nothing.",
      needs: ["Sunchokes"],
      nice: ["Storage onions", "Thyme, sage & oregano"] },

    { name: "Shredded sprouts, fried",
      note: "Take them off the stalk, slice them thin, and get the pan hotter than feels wise. Whole boiled sprouts are the reason people think they dislike them.",
      needs: ["Brussels sprouts"] },

    { name: "Collards, long-braised",
      note: "An hour at least. They are not spinach and will not behave like it.",
      needs: ["Collards"],
      nice: ["Garlic", "Hot peppers"] },

    { name: "Kale and white beans",
      note: "Cheap, filling, and better in January than in September, because the frost has already done half the work.",
      needs: ["Kale"],
      nice: ["Garlic", "Storage onions"] },

    { name: "Cabbage, slow-cooked",
      note: "A dense autumn head, cut in wedges, cooked far longer than seems right.",
      needs: ["Cabbage"],
      nice: ["Storage onions", "Thyme, sage & oregano"] },

    { name: "Winter squash, roasted",
      note: "Butternut or kabocha, halved, cut side down. Delicata is better but does not keep, so it is an October dish rather than a February one.",
      needs: ["Winter squash"],
      nice: ["Thyme, sage & oregano"] },

    { name: "Sweet potato, baked whole",
      note: "No foil, no oil, an hour. The cure has already made it sweet.",
      needs: ["Sweet potatoes"] },

    { name: "Apple sauce",
      note: "Goldrush in March is still sharp enough to need almost no sugar.",
      needs: ["Apples"] },

    /* --- the hungry gap breaking --- */
    { name: "Shad roe with bacon",
      note: "The most seasonal thing on this chart and one of the shortest windows on it. Two lobes, a hot pan, bacon fat, and lemon. It arrives in April, it is gone by May, and the rest of the year there is no substitute for it at any price.",
      needs: ["Shad & shad roe"],
      nice: ["Parsley"] },

    { name: "Ramps, grilled whole",
      note: "Char the leaves, keep the bulbs just short of burnt.",
      needs: ["Ramps"] },

    { name: "Morels with cream",
      note: "Halved, rinsed hard because they are always full of grit, then cream and nothing else competing.",
      needs: ["Morels"],
      nice: ["Chives"] },

    { name: "Asparagus and morels",
      note: "Both are at their best in the same three or four weeks of late April, which is either a coincidence or the strongest argument this chart makes.",
      needs: ["Asparagus", "Morels"],
      nice: ["Chives"] },

    { name: "Asparagus with a fried egg",
      note: "Six weeks a year. Do not buy it in November.",
      needs: ["Asparagus"],
      nice: ["Chives", "Parsley"] },

    { name: "Fiddleheads, blanched then fried",
      note: "Blanch them properly first — this is not optional, they are mildly toxic raw — then butter and lemon. Three weeks along the creek bottoms and then nothing until next spring.",
      needs: ["Fiddlehead ferns"] },

    { name: "Nettle soup",
      note: "Free, and better than most things you could buy in April. Gloves to pick, then heat kills the sting outright.",
      needs: ["Stinging nettles"],
      nice: ["Potatoes", "Storage onions"] },

    { name: "Green garlic soup",
      note: "Milder than the bulb and greener. Gone by June.",
      needs: ["Green garlic"],
      nice: ["Potatoes"] },

    { name: "Pea shoots, wilted",
      note: "Thirty seconds in a hot pan. One of the first green things at market and the fastest thing to overcook.",
      needs: ["Pea shoots"],
      nice: ["Garlic"] },

    { name: "Watercress salad",
      note: "Peppery, from the Brandywine spring beds, and it disappears the moment the streams warm.",
      needs: ["Watercress"] },

    { name: "Radishes, butter, salt",
      note: "Not a recipe. Still the best thing to do with a spring radish.",
      needs: ["Radishes"] },

    { name: "Rhubarb, stewed",
      note: "Sugar, a strip of orange peel, and no water.",
      needs: ["Rhubarb"] },

    { name: "Strawberry and rhubarb",
      note: "The two overlap for about six weeks and the pairing is a cliché because it works — the rhubarb keeps the strawberries from going flat and sweet.",
      needs: ["Strawberries", "Rhubarb"] },

    { name: "Elderflower cordial",
      note: "Cut the heads on a dry morning, or you get green instead of perfume. A fortnight in June.",
      needs: ["Elderflower"] },

    /* --- June into high summer --- */
    { name: "Garlic scapes, blistered",
      note: "Three weeks. Buy more than you need and freeze the rest.",
      needs: ["Garlic scapes"] },

    { name: "Fava, pecorino and mint",
      note: "Double-podded, raw or barely cooked. The tedium is the price of admission.",
      needs: ["Fava beans", "Mint"] },

    { name: "Shell peas with lettuce",
      note: "Braised together with butter. A pound of pods gives about a cup of peas, which is why nobody sells them shelled.",
      needs: ["Shell peas", "Head & leaf lettuce"] },

    { name: "Sorrel sauce for fluke",
      note: "The sorrel collapses to a purée in the pan and the acid does what a squeeze of lemon only gestures at. Both are around together for a few weeks in June and again briefly in September.",
      needs: ["Sorrel", "Fluke"] },

    { name: "Soft-shells, fried whole",
      note: "Shell and all. The first big run follows the May full moon.",
      needs: ["Soft-shell crab"],
      nice: ["Parsley"] },

    { name: "Squash blossoms, stuffed and fried",
      note: "Ricotta, a thin batter, and speed — they are cut at dawn and last about a day.",
      needs: ["Squash blossoms"] },

    { name: "Sour cherry clafoutis",
      note: "Montmorency, too sharp to eat raw, which is exactly why they make the better pudding. Four weeks.",
      needs: ["Sour cherries"] },

    { name: "Blueberry cobbler",
      note: "Hammonton fruit, and enough of it that the topping struggles.",
      needs: ["Blueberries"] },

    { name: "Blue crab, steamed",
      note: "Old Bay, newspaper, a mallet, and several hours you were not planning to spend. Heaviest in late summer just before they move to deep water.",
      needs: ["Blue crab"] },

    { name: "Bluefish, grilled with lemon",
      note: "Cheap, oily, and only worth eating within a day of landing.",
      needs: ["Bluefish"] },

    { name: "Pesto, made in quantity",
      note: "Basil dies on the first cold night without any tapering off, so this gets made in the week before the forecast turns. It freezes well in small jars; the garlic does not, so leave it out until you thaw it.",
      needs: ["Basil"],
      nice: ["Garlic", "Black walnuts"] },

    /* --- the top of the year --- */
    { name: "Tomatoes and corn",
      note: "Raw kernels cut off the cob, tomatoes at room temperature, salt, and enough time on the counter for the juice to come out. The overlap at peak is about five weeks. Everything else about it is negotiable.",
      needs: ["Field tomatoes", "Sweet corn"],
      nice: ["Basil", "Hot peppers"] },

    { name: "Sliced tomatoes, salt",
      note: "The whole point of the year, and it needs nothing.",
      needs: ["Field tomatoes"],
      nice: ["Basil"] },

    { name: "Corn on the cob",
      note: "Supersweets hold their sugar for days now, so the old sprint from field to pot is less urgent than it was.",
      needs: ["Sweet corn"] },

    { name: "Limas with corn",
      note: "Fresh shelling limas, which bear no relation to the frozen kind, and corn cut off the cob. Both are around for about nine weeks together.",
      needs: ["Lima beans", "Sweet corn"] },

    { name: "Long hots, fried",
      note: "In oil until they blister and collapse. The local staple pepper, and the one a Philadelphia sandwich assumes.",
      needs: ["Hot peppers"],
      nice: ["Garlic"] },

    { name: "Eggplant, charred whole",
      note: "Straight onto the flame until the skin gives, then scoop it out.",
      needs: ["Eggplant"],
      nice: ["Garlic", "Parsley"] },

    { name: "Peaches with basil",
      note: "An unlikely pairing that works for the ten weeks they overlap.",
      needs: ["Peaches", "Basil"] },

    { name: "Chanterelles on toast",
      note: "A few days after a soaking rain, in oak woods. Apricot-scented, and they need almost nothing done to them.",
      needs: ["Chanterelles"],
      nice: ["Parsley", "Thyme, sage & oregano"] },

    /* --- autumn --- */
    { name: "Figs with black walnuts",
      note: "Off a South Philly tree in late August if you know someone.",
      needs: ["Figs"],
      nice: ["Black walnuts"] },

    { name: "Pawpaw, with a spoon",
      note: "Cut in half, discard the seeds, eat it standing up. It bruises in two days and will not ship, so this is the only way most people will ever have one.",
      needs: ["Pawpaw"] },

    { name: "Maitake, roasted in a dry pan",
      note: "Torn into pieces, no oil until the water has gone.",
      needs: ["Maitake"] },

    { name: "Chicken of the woods, fried",
      note: "Only the young outer edges. The rest is wood.",
      needs: ["Chicken of the woods"] },

    { name: "Escarole and beans",
      note: "The city's dish. Cannellini, a lot of garlic, and the bitterness left in.",
      needs: ["Escarole & endive"],
      nice: ["Garlic"] },

    { name: "Broccoli rabe with pork",
      note: "Blanch the rabe first, then roast pork and sharp provolone. This is the sandwich the argument is actually about.",
      needs: ["Broccoli rabe"],
      nice: ["Garlic", "Hot peppers"] },

    { name: "Cardoons, gratinéed",
      note: "Strip the strings, braise them soft, then cheese and a hot grill. A 9th Street tradition and an autumn-only one.",
      needs: ["Cardoons"] },

    { name: "Quince paste",
      note: "Inedible raw, and it turns from pale yellow to deep red over a couple of hours of cooking without anything being added. Seven weeks a year.",
      needs: ["Quince"] },

    { name: "Persimmon pudding",
      note: "Asian varieties, jelly-soft or not at all.",
      needs: ["Persimmons"] },

    { name: "Cranberry sauce",
      note: "Pine Barrens fruit, an orange, and less sugar than the recipe says.",
      needs: ["Cranberries"] },

    { name: "Grape focaccia",
      note: "Concord grapes pressed into the dough, slip-skins and all. They are wildly perfumed and nothing like a table grape, which is the point.",
      needs: ["Grapes"],
      nice: ["Rosemary"] }
  ]
};
