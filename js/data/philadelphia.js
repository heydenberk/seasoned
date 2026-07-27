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
    { id: "fruit", name: "Fruit & Berries",          rgb: "176,42,71" },
    { id: "vine",  name: "Fruiting & Vine Crops",    rgb: "210,98,43" },
    { id: "root",  name: "Roots, Tubers & Alliums",  rgb: "160,124,44" },
    { id: "leaf",  name: "Leafy Greens & Salad",     rgb: "110,158,40" },
    { id: "brass", name: "Brassicas, Stalks & Pods", rgb: "29,112,82" },
    { id: "herb",  name: "Herbs & Aromatics",        rgb: "46,143,166" },
    { id: "fungi", name: "Mushrooms & Foraged",      rgb: "123,94,160" },
    { id: "water", name: "From the Water",           rgb: "47,94,158" }
  ],

  /* [name, categoryIndex, windows, note]
     window = [startWeek, endWeek, kind]
     kind: s = available · p = peak · t = storage/glasshouse */
  crops: [
  /* --- FRUIT & BERRIES --- */
  ["Rhubarb",0,[[15,25,"s"],[17,21,"p"]],"The first thing all year that behaves like fruit. Field stalks out of Lancaster County arrive well before anything is actually sweet."],
  ["Strawberries",0,[[20,26,"s"],[22,24,"p"]],"Chester County and South Jersey fields. A four-week blaze and then nothing — the flats you see in July came from California."],
  ["Sweet cherries",0,[[24,27,"s"],[25,26,"p"]],"Short and weather-fragile here; a hard rain at colour split can end the crop in a day."],
  ["Sour cherries",0,[[25,28,"s"],[26,27,"p"]],"Montmorency. Too sharp to eat raw, which is why they cost less and make the better pie."],
  ["Blueberries",0,[[25,33,"s"],[27,31,"p"]],"Hammonton, New Jersey grows more of them than almost anywhere on earth, forty minutes from Center City."],
  ["Black raspberries",0,[[25,28,"s"],[26,27,"p"]],"Two weeks, maybe three. The wild canes along the Wissahickon ripen at the same moment."],
  ["Red raspberries",0,[[25,29,"s"],[26,28,"p"],[34,42,"s"],[36,40,"p"]],"Two crops — a summer flush on last year's canes, then a longer and frankly better autumn run right up to frost."],
  ["Blackberries",0,[[28,35,"s"],[29,33,"p"]],"Thornless cultivars at market from late July; the hedgerow brambles run a fortnight behind."],
  ["Currants & gooseberries",0,[[25,29,"s"],[26,28,"p"]],"Rare here — a handful of growers keep them going. Buy them the day you see them."],
  ["Apricots",0,[[27,30,"s"],[28,29,"p"]],"A gamble in this climate. Late frosts take the crop roughly one year in three."],
  ["Peaches",0,[[28,37,"s"],[30,35,"p"]],"Jersey and Adams County. Yellow varieties first, whites from mid-August, and the last freestones are the best of them."],
  ["Nectarines",0,[[29,36,"s"],[31,34,"p"]],"Same orchards as the peaches, a week behind and considerably more fragile."],
  ["Plums",0,[[31,38,"s"],[32,36,"p"]],"Japanese types first; then Italian prune plums in September, which are the ones worth roasting."],
  ["Cantaloupe & muskmelon",0,[[30,37,"s"],[31,35,"p"]],"Jersey sand soil grows an extraordinary melon. Smell the stem end, never the skin."],
  ["Watermelon",0,[[31,37,"s"],[32,36,"p"]],"Local fruit lands well after the supermarket has been selling southern melons all summer."],
  ["Elderberries",0,[[32,37,"s"],[33,35,"p"]],"Hedgerow and small-farm fruit, almost always cooked. The flowers come six weeks earlier."],
  ["Figs",0,[[33,41,"s"],[35,39,"p"]],"A South Philly institution — trees wrapped in tarpaper and old carpet each winter, fruit in the alleys by late August."],
  ["Apples",0,[[32,46,"s"],[36,43,"p"],[47,52,"t"],[1,18,"t"]],"Ginger Gold and early Galas from August. The storage varieties that matter — Goldrush, Winesap — carry all the way to spring."],
  ["Pears",0,[[33,43,"s"],[35,40,"p"],[44,50,"t"]],"Picked hard and ripened off the tree. Bartlett first, then Bosc and Comice into October."],
  ["Asian pears",0,[[35,42,"s"],[36,40,"p"]],"They ripen on the tree, unlike European pears, and hold for months in the cold."],
  ["Grapes",0,[[35,42,"s"],[36,40,"p"]],"Concord and Niagara — slip-skin, wildly perfumed, nothing whatsoever like a table grape."],
  ["Pawpaw",0,[[34,40,"s"],[36,38,"p"]],"North America's largest native fruit: custardy, somewhere between mango and banana, and it bruises in two days. That's why you'll never see one in a supermarket."],
  ["Persimmons",0,[[40,47,"s"],[42,45,"p"]],"Asian varieties at market. Wild American persimmons along field edges, but only after a hard frost."],
  ["Quince",0,[[40,46,"s"],[41,44,"p"]],"Inedible raw and magnificent cooked. A few old orchards in Bucks and Chester counties still have trees."],
  ["Cranberries",0,[[40,47,"s"],[41,45,"p"]],"The Pine Barrens bogs make New Jersey one of the country's top producers. Fresh berries freeze perfectly."],

  /* --- FRUITING & VINE --- */
  ["Zucchini & summer squash",1,[[24,38,"s"],[26,34,"p"]],"Arrives in June and then refuses to stop. By August your farmer is trying to give it away."],
  ["Squash blossoms",1,[[25,33,"s"],[26,31,"p"]],"Male flowers, cut at dawn and sold the same morning. They last about a day."],
  ["Cucumbers",1,[[25,37,"s"],[27,34,"p"]],"Slicers from late June; the small Kirbys for pickling peak in the back half of July."],
  ["Green beans",1,[[25,38,"s"],[27,35,"p"]],"Successive sowings give a long run. Dragon tongue and haricots verts from the smaller growers."],
  ["Field tomatoes",1,[[29,41,"s"],[31,38,"p"]],"The whole point of the year. Real Jersey field fruit hits its stride in the last days of July — anything much earlier was grown under glass."],
  ["Cherry tomatoes",1,[[27,41,"s"],[29,38,"p"]],"A fortnight ahead of the big ones, and they keep going later into the cool nights."],
  ["Heirloom tomatoes",1,[[30,39,"s"],[31,37,"p"]],"Brandywine carries the name of the Chester County creek, though its actual origins are argued over. Either way it grows like it belongs here."],
  ["Tomatillos",1,[[30,39,"s"],[31,36,"p"]],"Grown seriously here now for the city's Mexican kitchens. Husks should be tight and papery."],
  ["Sweet corn",1,[[27,38,"s"],[30,35,"p"]],"Bicolour and white supersweets. The first fortnight of August is the top of it, and the sugar starts converting the hour it's picked."],
  ["Sweet peppers",1,[[29,41,"s"],[31,38,"p"]],"Green all summer. The red, yellow and chocolate ripe ones — twice the price and three times the pepper — come in September."],
  ["Hot peppers",1,[[30,41,"s"],[32,38,"p"]],"Long hots for frying are the local staple. Habaneros and the slow-ripening chillies only turn up in September."],
  ["Eggplant",1,[[29,40,"s"],[31,37,"p"]],"Globe, Italian and the slim Asian types. Heavy for its size means fewer seeds."],
  ["Okra",1,[[30,39,"s"],[32,36,"p"]],"Loves the humidity here. Take them under four inches or they turn to rope."],
  ["Lima beans",1,[[30,38,"s"],[32,36,"p"]],"Fresh shelling limas bear no relation at all to the frozen ones. Sold in the pod, usually by the quart."],
  ["Edamame",1,[[30,37,"s"],[31,35,"p"]],"A few growers sell it still on the stalk, which keeps the beans fresh for days."],
  ["Winter squash",1,[[35,48,"s"],[37,44,"p"],[49,52,"t"],[1,8,"t"]],"Delicata and acorn first, and they don't keep. Butternut, kabocha and hubbard hold in a cool room until spring."],
  ["Pumpkins",1,[[37,45,"s"],[39,43,"p"]],"Field pumpkins for carving. The small sugar and cheese pumpkins are the ones for the pie."],

  /* --- ROOTS, TUBERS & ALLIUMS --- */
  ["Green garlic",2,[[14,21,"s"],[16,19,"p"]],"Immature garlic pulled as a thinning, the whole plant edible. Milder and greener than the bulb."],
  ["Spring onions & scallions",2,[[15,27,"s"],[17,23,"p"],[35,45,"s"]],"Continuous from mid-April. The fat ones with a real bulb are the April-to-June crop."],
  ["Radishes",2,[[14,24,"s"],[16,21,"p"],[35,46,"s"],[37,43,"p"]],"A cool-weather crop that turns woody and hot by July, then comes back crisp in September."],
  ["Hakurei turnips",2,[[15,24,"s"],[17,22,"p"],[36,47,"s"]],"Small, white, sweet enough to eat raw. Buy them with the greens on and cook both."],
  ["Beets",2,[[21,30,"s"],[23,28,"p"],[36,48,"s"],[38,45,"p"],[49,52,"t"],[1,12,"t"]],"Bunched with their greens in summer, topped and cellared from November. Chioggia and golden alongside the red."],
  ["Carrots",2,[[22,30,"s"],[24,28,"p"],[36,48,"s"],[39,46,"p"],[49,52,"t"],[1,14,"t"]],"The autumn crop is a different vegetable. Cold converts starch to sugar, so carrots pulled after a frost are candy."],
  ["New potatoes",2,[[25,31,"s"],[26,29,"p"]],"Dug young with the skins still rubbing off. They won't keep, so they're cheap and they're a treat."],
  ["Potatoes",2,[[28,44,"s"],[31,41,"p"],[45,52,"t"],[1,20,"t"]],"Main crop from August. Cellared stock stays genuinely local right through winter and into April."],
  ["Sweet potatoes",2,[[36,43,"s"],[38,42,"p"],[44,52,"t"],[1,16,"t"]],"Cured for a fortnight after digging, which is the step that makes them sweet. Then they store until spring."],
  ["Fresh onions",2,[[25,33,"s"],[27,31,"p"]],"Thin-skinned summer onions sold uncured. Sweet, juicy, and they'll go soft in two weeks."],
  ["Storage onions",2,[[34,52,"t"],[1,14,"t"]],"Cured in August, then papery and reliable all winter. The workhorse of the lean months."],
  ["Garlic",2,[[27,32,"s"],[28,30,"p"],[33,52,"t"],[1,12,"t"]],"Hardneck varieties pulled in July and cured, then sold all winter. Buy the year's supply in August."],
  ["Shallots",2,[[28,34,"s"],[29,32,"p"],[35,50,"t"]],"Lifted with the garlic and cured the same way; they keep nearly as long."],
  ["Leeks",2,[[36,52,"s"],[40,49,"p"],[1,9,"t"]],"They stand in frozen ground and get better for it. The backbone of a Philadelphia January."],
  ["Celeriac",2,[[38,48,"s"],[40,46,"p"],[49,52,"t"],[1,6,"t"]],"Ugly, knobbly, and the best root in the market for soup. Keeps for months wrapped in the fridge."],
  ["Parsnips",2,[[40,52,"s"],[43,50,"p"],[1,13,"s"],[9,12,"p"]],"Dug after hard frost. The ones lifted in March, having overwintered in the ground, are the sweetest vegetable of the whole year."],
  ["Rutabaga",2,[[39,50,"s"],[41,47,"p"],[51,52,"t"],[1,6,"t"]],"Waxed for storage at the supermarket; unwaxed and far better at market from October."],
  ["Daikon & watermelon radish",2,[[38,48,"s"],[40,45,"p"]],"Autumn radishes that grow large and stay mild. The watermelon ones are magenta all the way through."],
  ["Purple-top turnips",2,[[38,49,"s"],[40,46,"p"]],"The big storage turnip, sweeter after frost. Greens sold separately and worth taking."],
  ["Sunchokes",2,[[40,52,"s"],[42,49,"p"],[1,14,"s"],[9,13,"p"]],"A native perennial, dug all winter whenever the ground gives. Nutty, and best roasted hard."],
  ["Horseradish",2,[[40,48,"s"],[10,15,"s"]],"Dug in autumn and again at the very start of spring. Grate it outdoors — that is not a joke."],

  /* --- LEAFY GREENS & SALAD --- */
  ["Spinach",3,[[12,22,"s"],[14,19,"p"],[37,48,"s"],[39,45,"p"],[49,52,"t"],[1,11,"t"]],"Overwintered spinach lifted in March is nearly sugary, and a completely different thing from the summer crop, which bolts."],
  ["Arugula",3,[[14,25,"s"],[15,21,"p"],[35,48,"s"],[37,44,"p"]],"Peppery in the cool and ferocious in the heat. September rocket is the good stuff."],
  ["Head & leaf lettuce",3,[[14,26,"s"],[16,23,"p"],[35,47,"s"],[37,44,"p"]],"Disappears for six weeks in high summer when it bolts and turns bitter, then returns in September."],
  ["Mesclun & baby greens",3,[[13,27,"s"],[15,23,"p"],[34,48,"s"],[36,45,"p"],[49,52,"t"],[1,12,"t"]],"Cut-and-come-again mixes. Tunnel growers keep a thin supply running through most of the winter."],
  ["Pea shoots",3,[[12,23,"s"],[14,20,"p"],[36,46,"s"]],"Grown under cover, and one of the very first green things at market — long before anything is in the field."],
  ["Sorrel",3,[[13,25,"s"],[15,21,"p"],[36,46,"s"]],"A perennial, so it's among the first to wake up. Sharp with lemon acid; collapses to a purée in a hot pan."],
  ["Asian greens",3,[[14,24,"s"],[35,48,"s"],[37,44,"p"]],"Tatsoi, mizuna, komatsuna. Cold-hardy, so they run later into the autumn than lettuce manages."],
  ["Bok choy",3,[[15,25,"s"],[36,47,"s"],[38,44,"p"]],"Baby heads in spring, full size in autumn. Grown heavily for the city's Asian markets."],
  ["Swiss chard",3,[[19,47,"s"],[24,42,"p"]],"The most forgiving green in this climate — sow it in May and cut from it until the ground freezes."],
  ["Kale",3,[[17,27,"s"],[19,24,"p"],[33,52,"s"],[40,50,"p"],[1,9,"t"]],"Wait for it. Kale cut after the first hard frost is sweet; kale in September is just fibrous."],
  ["Collards",3,[[20,27,"s"],[35,52,"s"],[41,50,"p"],[1,8,"t"]],"Frost-sweetened like kale and better able to take a real freeze. Holds in the field into January."],
  ["Escarole & endive",3,[[20,27,"s"],[36,48,"s"],[39,45,"p"]],"The bitter chicories, and the heart of an Italian-Philadelphian kitchen. Escarole and beans is a city dish."],
  ["Radicchio & chicory",3,[[20,26,"s"],[37,48,"s"],[40,46,"p"]],"Autumn is the only serious season — cold is what sets the colour and tempers the bitterness."],
  ["Watercress",3,[[13,22,"s"],[15,20,"p"],[36,45,"s"]],"Spring-fed beds in the Brandywine watershed. Cold running water only, so it vanishes in summer."],
  ["Dandelion & chicory greens",3,[[12,22,"s"],[13,18,"p"],[36,45,"s"]],"The first green at the 9th Street stalls, sometimes in early March. Bitter, and meant to be."],

  /* --- BRASSICAS, STALKS & PODS --- */
  ["Asparagus",4,[[15,24,"s"],[17,21,"p"]],"The opening bell of the year. Chester and Lancaster county beds are cut daily for six weeks and then stop dead."],
  ["Sugar snap & snow peas",4,[[19,27,"s"],[21,25,"p"]],"Sweet only while the nights stay cool. The first hot spell in late June finishes them."],
  ["Shell peas",4,[[20,26,"s"],[22,25,"p"]],"A pound in the pod yields about a cup shelled, which is why almost nobody grows them commercially any more."],
  ["Fava beans",4,[[20,26,"s"],[21,24,"p"]],"Double-podding is tedious and entirely worth it. One short window in June."],
  ["Garlic scapes",4,[[20,24,"s"],[21,23,"p"]],"The flower stalk, snapped off so the bulb sizes up. Three weeks in June and gone — buy extra and freeze them."],
  ["Kohlrabi",4,[[20,27,"s"],[38,47,"s"],[40,45,"p"]],"Peeled deeply and eaten raw it's the crispest thing at the market. Autumn bulbs grow big without going woody."],
  ["Broccoli",4,[[21,28,"s"],[22,26,"p"],[36,46,"s"],[38,44,"p"]],"Hates heat, so it comes in two runs. The side shoots after the main head are the cook's secret."],
  ["Broccoli rabe",4,[[15,24,"s"],[17,22,"p"],[36,49,"s"],[39,46,"p"]],"Philadelphia's own green. Roast pork, sharp provolone, rabe — the argument about this city's sandwich ends there."],
  ["Cauliflower",4,[[22,27,"s"],[37,46,"s"],[39,44,"p"]],"Demanding and weather-sensitive. The autumn crop is far more reliable than the spring one."],
  ["Cabbage",4,[[22,29,"s"],[23,27,"p"],[36,48,"s"],[39,45,"p"],[49,52,"t"],[1,8,"t"]],"Summer heads are loose and mild. The dense autumn heads are what you want for kraut and long keeping."],
  ["Napa cabbage",4,[[22,27,"s"],[37,47,"s"],[39,44,"p"]],"Autumn is the real season. Grown widely here for kimchi, and it holds in the fridge for weeks."],
  ["Brussels sprouts",4,[[40,52,"s"],[43,50,"p"],[1,6,"t"]],"Sold on the stalk from late October. Every hard frost makes them measurably better."],
  ["Fennel",4,[[20,27,"s"],[37,47,"s"],[39,44,"p"]],"Bolts in heat, so the autumn bulbs are fatter and sweeter. Keep the fronds."],
  ["Celery",4,[[30,42,"s"],[32,39,"p"]],"Local celery is short, dark green and aggressively flavoured — closer to a herb than to the pale supermarket kind."],
  ["Cardoons",4,[[38,46,"s"],[40,44,"p"]],"Thistle stalks, blanched and braised, a 9th Street tradition. Autumn only, and you have to look."],

  /* --- HERBS & AROMATICS --- */
  ["Chives",5,[[13,44,"s"],[15,25,"p"]],"Up before almost anything else. The purple blossoms in May are edible and make a very good vinegar."],
  ["Mint",5,[[17,42,"s"],[20,36,"p"]],"Perennial and invasive. Anyone with a yard has more than they want by July."],
  ["Cilantro",5,[[16,26,"s"],[17,23,"p"],[36,46,"s"],[38,44,"p"]],"Bolts the moment it turns hot, so it's a spring and autumn herb. The coriander seed comes in between."],
  ["Dill",5,[[20,40,"s"],[24,34,"p"]],"Timed by growers to land with the pickling cucumbers in July. Heads and fronds both."],
  ["Parsley",5,[[18,48,"s"],[22,42,"p"]],"Flat-leaf, hardy well past frost, and often the last green thing standing in a November field."],
  ["Basil",5,[[24,40,"s"],[27,37,"p"]],"Killed outright by the first cold night — not even a frost, just forty degrees. Make the pesto the week before."],
  ["Thyme, sage & oregano",5,[[16,48,"s"],[20,42,"p"]],"Woody perennials, cut from spring to hard frost, and the sage will often go straight through winter."],
  ["Rosemary",5,[[16,48,"s"],[20,42,"p"]],"Marginally hardy here. A sheltered South Philly wall will carry a plant through most winters."],
  ["Tarragon",5,[[17,40,"s"],[20,34,"p"]],"French tarragon only. The Russian sort looks identical and tastes of nothing at all."],
  ["Shiso",5,[[26,38,"s"],[28,35,"p"]],"Grown for the city's Japanese and Korean kitchens, and it self-seeds enthusiastically once you have it."],
  ["Lovage",5,[[15,30,"s"],[17,26,"p"]],"An old kitchen-garden perennial, up very early, tasting like concentrated celery."],

  /* --- MUSHROOMS & FORAGED --- */
  ["Cultivated mushrooms",6,[[1,52,"s"],[1,52,"p"]],"Kennett Square, forty-five minutes west, grows the majority of America's mushrooms. The one thing on this chart that is genuinely local in all fifty-two weeks."],
  ["Ramps",6,[[14,18,"s"],[15,17,"p"]],"Wild leeks from the wooded slopes. Slow-growing and badly over-harvested — take one leaf and leave the bulb."],
  ["Fiddlehead ferns",6,[[15,19,"s"],[16,18,"p"]],"Ostrich fern only, and they must be cooked through. Two or three weeks along the creek bottoms."],
  ["Stinging nettles",6,[[13,20,"s"],[14,17,"p"]],"Free, everywhere, and excellent. Heat destroys the sting completely."],
  ["Garlic mustard",6,[[12,19,"s"],[13,17,"p"]],"An aggressive invasive with a fine pungent green. Foraging it is a public service."],
  ["Morels",6,[[16,20,"s"],[17,19,"p"]],"Late April into May, around dying elms and old orchards. Never sold cheaply and never sold for long."],
  ["Chanterelles",6,[[27,36,"s"],[29,34,"p"]],"Midsummer, a few days after a soaking rain, in oak woods. Apricot-scented and unmistakable once you've smelled one."],
  ["Chicken of the woods",6,[[34,44,"s"],[36,41,"p"]],"A bright orange bracket on oak. Only the young, soft outer edges are worth taking."],
  ["Maitake",6,[[37,44,"s"],[38,42,"p"]],"Hen of the woods, at the foot of old oaks. The same tree will fruit year after year."],
  ["Black walnuts",6,[[39,44,"s"],[40,43,"p"]],"All over the city's parks. Enormous work to hull and crack, and a flavour nothing else has."],
  ["Elderflower",6,[[22,25,"s"],[23,24,"p"]],"Two weeks in early June. Cut the heads on a dry morning and you get the perfume; wet ones just taste green."],

  /* --- FROM THE WATER --- */
  ["Shad & shad roe",7,[[13,20,"s"],[15,18,"p"]],"The Delaware River run — the fish that fed colonial Philadelphia, and reputedly Washington's army at Valley Forge."],
  ["Blue crab",7,[[17,47,"s"],[27,40,"p"]],"Delaware and Chesapeake bays. Heaviest and fattest in late summer, just before they move to deep water."],
  ["Soft-shell crab",7,[[20,33,"s"],[22,29,"p"]],"Crabs taken in the hours after moulting. The first big run follows the full moon in May."],
  ["Striped bass",7,[[14,23,"s"],[16,21,"p"],[36,48,"s"],[40,46,"p"]],"Two runs past the coast, spring and autumn. The rules change year to year and supply moves with them."],
  ["Fluke",7,[[19,37,"s"],[24,33,"p"]],"Summer flounder off the Jersey inshore grounds. Sweet, firm, and the default local white fish."],
  ["Bluefish",7,[[20,44,"s"],[26,38,"p"]],"Oily, cheap and superb if eaten within a day. Anything older tastes of exactly why people avoid it."],
  ["Weakfish",7,[[18,25,"s"],[36,42,"s"],[38,41,"p"]],"Sea trout — delicate, soft-fleshed, and it has to be cooked the day it lands."],
  ["Delaware Bay oysters",7,[[36,52,"s"],[40,50,"p"],[1,17,"s"],[1,12,"p"]],"The old rule about months with an R still tracks the wild season, though farmed stock is now good year-round."],
  ["Cape May scallops",7,[[1,52,"s"],[40,52,"p"],[1,10,"p"]],"Cape May is one of the largest scallop ports on the East Coast. Dry-packed day-boat scallops are worth the premium."],
  ["Hard clams",7,[[1,52,"s"],[22,40,"p"]],"Littlenecks and cherrystones out of Barnegat and Delaware bays, dug all year."],
  ["Atlantic mackerel",7,[[40,52,"s"],[45,52,"p"],[1,14,"s"],[1,8,"p"]],"A cold-water winter fish that arrives exactly when almost nothing green is left."],
  ["Monkfish",7,[[44,52,"s"],[47,52,"p"],[1,14,"s"],[1,9,"p"]],"Winter landings out of Cape May and Barnegat Light. Tails only, and far better than they look."]
  ]
};
