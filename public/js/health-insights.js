(function () {
    "use strict";

    const base = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1);
    const mealApi = base + "api/meal-entries";
    const weightApi = base + "api/weight-logs";
    let timer = null;

    document.addEventListener("DOMContentLoaded", function () {
        inject();
        refresh();
    });

    window.FitHealthInsights = {
        refresh,
        recordWeight
    };

    function api() {
        return window.FitHealthNutrition || null;
    }

    function inject() {
        const health = document.getElementById("healthTab");
        const nutrition = document.getElementById("nutritionTab");

        if (health && !document.getElementById("weightProgressPanel")) {
            health.insertAdjacentHTML("beforeend",
                '<section class="insight-section mt-4" id="weightProgressPanel">' +
                '<div class="insight-heading"><div><p class="text-success fw-bold mb-1">PROGRESS</p>' +
                '<h2 class="fw-bold mb-1">Weight Progress</h2><p class="text-body-secondary mb-0">Track your weight changes over time.</p></div>' +
                '<div class="insight-heading-icon"><i class="bi bi-graph-up-arrow"></i></div></div>' +
                '<div id="weightProgressContent" class="mt-4"><div class="insight-loading">Loading weight history...</div></div></section>'
            );
        }

        if (nutrition && !document.getElementById("smartNutritionPanel")) {
            nutrition.insertAdjacentHTML("beforeend",
                '<section class="insight-section mt-4" id="smartNutritionPanel">' +
                '<div class="insight-heading"><div><p class="text-success fw-bold mb-1">SMART NUTRITION</p>' +
                '<h2 class="fw-bold mb-1">What Should I Eat Next?</h2><p class="text-body-secondary mb-0">Based on the nutrients you still need today.</p></div>' +
                '<div class="insight-heading-icon"><i class="bi bi-stars"></i></div></div>' +
                '<div id="nutritionSuggestionContent" class="mt-4"></div></section>' +
                '<section class="insight-section mt-4" id="weeklyNutritionPanel">' +
                '<div class="insight-heading"><div><p class="text-success fw-bold mb-1">7-DAY VIEW</p>' +
                '<h2 class="fw-bold mb-1">Weekly Nutrition Insight</h2><p class="text-body-secondary mb-0">Average intake and target consistency.</p></div>' +
                '<div class="insight-heading-icon"><i class="bi bi-calendar-week"></i></div></div>' +
                '<div id="weeklyNutritionContent" class="mt-4"><div class="insight-loading">Loading weekly nutrition...</div></div></section>'
            );
        }
    }

    function refresh() {
        clearTimeout(timer);
        timer = setTimeout(async function () {
            inject();
            renderSuggestions();
            await Promise.allSettled([loadWeek(), loadWeights()]);
        }, 100);
    }

    function totals(entries) {
        return (entries || []).reduce(function (t, e) {
            t.calories += n(e.calories); t.protein += n(e.protein); t.carbs += n(e.carbs); t.fat += n(e.fat);
            return t;
        }, {calories: 0, protein: 0, carbs: 0, fat: 0});
    }

    function remaining(profile, t) {
        return {
            calories: Math.max(0, n(profile.targetCalories) - t.calories),
            protein: Math.max(0, n(profile.proteinTarget) - t.protein),
            carbs: Math.max(0, n(profile.carbsTarget) - t.carbs),
            fat: Math.max(0, n(profile.fatTarget) - t.fat)
        };
    }

    function renderSuggestions() {
        const box = document.getElementById("nutritionSuggestionContent");
        const a = api();
        if (!box || !a) return;
        const p = a.getProfile();
        if (!p) { box.innerHTML = empty("Complete your Health Profile first."); return; }
        const r = remaining(p, totals(a.getMeals()));
        const suggestions = [];

        (a.getFoods() || []).forEach(function (food) {
            const amounts = food.nutritionType === "serving" ? [1, 2] : [100, 150, 200, 250, 300];
            let best = null;
            amounts.forEach(function (amount) {
                const ratio = food.nutritionType === "serving" ? amount : amount / 100;
                const x = {calories:n(food.calories)*ratio, protein:n(food.protein)*ratio, carbs:n(food.carbs)*ratio, fat:n(food.fat)*ratio};
                let score = fit(x.calories,r.calories,p.targetCalories) * 20 + fit(x.protein,r.protein,p.proteinTarget) * 30 + fit(x.carbs,r.carbs,p.carbsTarget) * 30 + fit(x.fat,r.fat,p.fatTarget) * 25;
                if (food.supplement) score -= 4;
                if (!best || score > best.score) best = {food, amount, x, score};
            });
            if (best) suggestions.push(best);
        });

        suggestions.sort(function (a,b) { return b.score - a.score; });
        const top = suggestions.slice(0,3);
        const need = '<div class="remaining-nutrients-grid">' + metric("Calories",Math.round(r.calories),"kcal") + metric("Protein",one(r.protein),"g") + metric("Carbs",one(r.carbs),"g") + metric("Fat",one(r.fat),"g") + '</div>';
        if (!top.length) { box.innerHTML = need + empty("No suitable food found."); return; }

        box.innerHTML = need + '<div class="suggestion-grid mt-3">' + top.map(function (s,i) {
            const unit = s.food.nutritionType === "serving" ? (s.food.servingUnit || "serving") : "g";
            return '<article class="food-suggestion-card"><div class="suggestion-rank">#'+(i+1)+'</div><h3 class="h5 fw-bold">'+esc(s.food.name)+'</h3>' +
                '<p class="small text-body-secondary">Suggested because it matches nutrients still missing today.</p>' +
                '<div class="suggestion-macro-row"><span><strong>'+Math.round(s.x.calories)+'</strong> kcal</span><span><strong>'+one(s.x.protein)+'</strong> P</span><span><strong>'+one(s.x.carbs)+'</strong> C</span><span><strong>'+one(s.x.fat)+'</strong> F</span></div>' +
                '<button class="btn btn-outline-success w-100 mt-3" data-food="'+s.food.id+'" data-amount="'+s.amount+'">Use '+s.amount+' '+esc(unit)+'</button></article>';
        }).join("") + '</div><p class="small text-body-secondary mt-3 mb-0">Suggestions are a planning aid, not medical advice.</p>';

        box.querySelectorAll("[data-food]").forEach(function (button) {
            button.addEventListener("click", function () { a.applyFoodSuggestion(Number(button.dataset.food), Number(button.dataset.amount)); });
        });
    }

    function fit(value, need, target) {
        target = Math.max(n(target), 1);
        if (need <= 0) return -(value / target) * 2;
        const useful = Math.min(value, need) / need;
        const over = Math.max(0, value - need) / target;
        return useful - over * 1.5;
    }

    async function loadWeek() {
        const box = document.getElementById("weeklyNutritionContent");
        const a = api();
        if (!box || !a || !a.getProfile()) return;
        const p = a.getProfile();
        const end = parseDate(a.getSelectedDate());
        const days = [];
        try {
            for (let offset=6; offset>=0; offset--) {
                const d = new Date(end); d.setDate(end.getDate()-offset);
                const date = dateString(d);
                const response = await fetch(mealApi+'?date='+encodeURIComponent(date), {credentials:"same-origin", cache:"no-store"});
                const data = await json(response);
                if (!response.ok || !data.success) throw new Error(data.message || "Unable to load weekly nutrition.");
                days.push(totals(data.entries || []));
            }
            const avg = {calories:average(days,"calories"), protein:average(days,"protein"), carbs:average(days,"carbs"), fat:average(days,"fat")};
            const targets = {calories:n(p.targetCalories), protein:n(p.proteinTarget), carbs:n(p.carbsTarget), fat:n(p.fatTarget)};
            const weakest = ["calories","protein","carbs","fat"].sort(function (x,y) { return ratio(avg[x],targets[x])-ratio(avg[y],targets[y]); })[0];
            box.innerHTML = '<div class="weekly-metrics-grid">' + weekly("Calories",avg.calories,targets.calories,"kcal",days,"calories") + weekly("Protein",avg.protein,targets.protein,"g",days,"protein") + weekly("Carbs",avg.carbs,targets.carbs,"g",days,"carbs") + weekly("Fat",avg.fat,targets.fat,"g",days,"fat") + '</div>' +
                '<div class="weekly-insight-message mt-3"><i class="bi bi-lightbulb-fill"></i><div><strong>Weekly insight</strong><p class="mb-0">Lowest average target coverage: <strong>'+esc(weakest)+'</strong> at about '+Math.round(ratio(avg[weakest],targets[weakest])*100)+'%.</p></div></div>';
        } catch (e) { console.error(e); box.innerHTML = empty(e.message || "Unable to load weekly insight."); }
    }

    function weekly(label, value, target, unit, days, key) {
        const count = days.filter(function (d) { const q=ratio(d[key],target); return q>=0.85 && q<=1.15; }).length;
        return '<div class="weekly-metric-card"><div class="d-flex justify-content-between"><span>'+label+'</span><strong>'+count+'/7 days</strong></div><div class="weekly-average">'+one(value)+' <small>/ '+one(target)+' '+unit+'</small></div><div class="weekly-progress"><div style="width:'+Math.min(ratio(value,target)*100,100)+'%"></div></div></div>';
    }

    async function recordWeight(weight, refreshAfter=true) {
        try {
            const response = await fetch(weightApi, {method:"POST", credentials:"same-origin", cache:"no-store", headers:{"Content-Type":"application/json"}, body:JSON.stringify({date:dateString(new Date()), weight:n(weight)})});
            const data = await json(response);
            if (!response.ok || !data.success) throw new Error(data.message || "Unable to save weight history.");
            if (refreshAfter) refresh();
            return data.entry;
        } catch (e) { console.error("Weight save:",e); return null; }
    }

    async function loadWeights() {
        const box = document.getElementById("weightProgressContent");
        const a = api();
        if (!box || !a) return;
        const p = a.getProfile();
        if (!p) { box.innerHTML = empty("Save your Health Profile to start tracking weight."); return; }
        try {
            let response = await fetch(weightApi+'?limit=30', {credentials:"same-origin", cache:"no-store"});
            let data = await json(response);
            if (!response.ok || !data.success) throw new Error(data.message || "Unable to load weight history.");
            let logs = data.entries || [];
            if (!logs.length) { await recordWeight(p.weight,false); response = await fetch(weightApi+'?limit=30',{credentials:"same-origin",cache:"no-store"}); data=await json(response); logs=data.entries||[]; }
            if (!logs.length) { box.innerHTML=empty("No weight history yet."); return; }
            const first=logs[0], current=logs[logs.length-1], change=n(current.weight)-n(first.weight);
            box.innerHTML='<div class="weight-summary-grid">'+wcard("Start",one(first.weight)+" kg",first.date)+wcard("Current",one(current.weight)+" kg",current.date)+wcard("Change",(change>0?"+":"")+one(change)+" kg",p.goal==="lose"&&change<0?"Moving toward goal":p.goal==="gain"&&change>0?"Moving toward goal":"Compared with first record")+'</div>'+weightChart(logs);
        } catch(e) { console.error(e); box.innerHTML=empty(e.message || "Unable to load weight progress."); }
    }

    function weightChart(logs) {
        if (logs.length < 2) return '<div class="single-weight-point mt-4"><i class="bi bi-record-circle"></i><strong>'+one(logs[0].weight)+' kg</strong><span>Save future Health Profile updates to build your trend.</span></div>';
        const vals=logs.map(function(x){return n(x.weight);}), min=Math.min.apply(null,vals)-0.5, max=Math.max.apply(null,vals)+0.5;
        const pts=vals.map(function(v,i){const x=40+(520*i/(vals.length-1)); const y=190-150*((v-min)/(max-min)); return x.toFixed(1)+','+y.toFixed(1);}).join(' ');
        return '<div class="weight-chart-wrap mt-4"><svg class="weight-chart" viewBox="0 0 600 220"><line x1="40" y1="190" x2="560" y2="190" class="chart-axis"></line><polyline points="'+pts+'" class="chart-line"></polyline></svg></div>';
    }

    function metric(label,value,unit) { return '<div class="remaining-nutrient"><span>'+label+'</span><strong>'+value+' '+unit+'</strong></div>'; }
    function wcard(label,value,helper) { return '<div class="weight-summary-card"><span>'+label+'</span><strong>'+esc(value)+'</strong><small>'+esc(helper || "")+'</small></div>'; }
    function empty(message) { return '<div class="insight-empty-state"><i class="bi bi-info-circle"></i><div><strong>FitHealth Insight</strong><p class="mb-0">'+esc(message)+'</p></div></div>'; }
    function average(days,key) { return days.reduce(function(s,d){return s+n(d[key]);},0)/Math.max(days.length,1); }
    function ratio(v,t) { return t>0?n(v)/t:1; }
    function n(v) { const x=Number(v); return Number.isFinite(x)?x:0; }
    function one(v) { return Number(n(v).toFixed(1)); }
    function dateString(d) { return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
    function parseDate(v) { const p=String(v||dateString(new Date())).split('-').map(Number); return new Date(p[0],p[1]-1,p[2]); }
    async function json(response) { const text=await response.text(); return text?JSON.parse(text):{}; }
    function esc(v) { return String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
}());
