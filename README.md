# Project 2 - UFO Visualization

[![Video of project2!](https://img.youtube.com/vi/iib3iEO6wPU/0.jpg)](https://www.youtube.com/watch?v=iib3iEO6wPU)

For our project we wanted to visualize UFO report data. We did this by making a word cloud, a relation diagram as well as a map relation. The dataset used was a pre-made .csv file obtained here: https://github.com/planetsig/ufo-reports. It was almost comical seeing the amount of reports on the 4th of July each year.

Reid Malone's contributions:

I was responsible for the word cloud. This takes in all of the data from a set range (which the user can set if they want) and displays
the top shape that was reported within the given time period. The word cloud works by setting the font size based upon how many occurances there were of that certain shape. The word cloud was inspired and used a library from https://github.com/jasondavies/d3-cloud.

Something that I noticed is that "Light" was always the number one shape. As you can see below in the two different date ranges.

![1949-2009](image2.png)

![2003-2009](image1.png)

Tori Huckabe's contributions:

Todd Robinson's contributions:

I designed the Force-Directed Relational Graph. I decided to find the relationship between the shapes of the UFO's reported, and the words used to describe each of them individually. The graph includes a search function to find any specific node, and hovering to display all first-order neighbors of any particular node. For my findings I saw that although there are several different shapes, each one had mostly the same terms used to describe them.

![Relationship](Ufo-data.jpg)
