---
layout: default
title: Security Program Scorecards
description: Assess your security program health with interactive metrics
---

<div class="container">
    <section class="hero">
        <h2>{{ site.data.site.hero.title }}</h2>
        <p>{{ site.data.site.hero.subtitle }}</p>
    </section>

    <div class="metrics-grid">
        {% for metric in site.data.metrics %}
            {% include metric-card.html metric=metric %}
        {% endfor %}
    </div>
</div> 