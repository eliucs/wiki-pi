## Overview

This page will help guide you through the Wiki Pi system, which has been
designed to be as straightforward and user-friendly as possible. The goal
of Wiki Pi is to represent Wikipedia as a graph, and be given a starting 
article and text similarily threshold to traverse through the graph 
collecting articles that pass that threshold. These articles are aggregated
into course material, where machine learning and natural language processing 
techniques are used for text summarization of this content. Then you
can progress open up the course, and progress through it.

## Generating a Course

1. On the homepage, click on "Create a new course", this will bring you to the 
New Course page. Search for a topic in the `Starting Article` field. Note
that this queries the entire database index (roughly 5 million articles), and
results will appear in real time as you type.

2. Then in the `Text Similarity` field, drag the slider for a value between 0
and 100 percent. This percentage represents the percentage similarity between
this starting article and any other article. This will be the primary metric 
of comparison between articles.

3. Once articles have been aggregated, you will be at the New Course Results page,
which shows on the left side all of the related articles that match the 
text similarity percentage. If you click on them, you can see a preview of the 
article. At the top right corner is a `Delete` button, which will exclude that 
particular article from showing up in the course. Note that all but the first 
article can be deleted.

4. Then you will be at the Open Course page. The new course you just made will 
appear here.

## Opening a Course

1. On the homepage, click on "Open an existing course", this will bring you to 
the Open Course page, which shows all of the courses that have been saved.

2. Each course's card has informaton on the title of the course (which is always 
the title of the starting article), the date created, and a chart that shows 
course progress. If you click on it, it will bring up a popup, which gives more
detail on the course, including course id, which differentiates courses with the 
same title, and a bar chart depicting course completion by section.

3. Click the `Open Course` button. This will take you to the Course page.

4. At the Course page, you can see statistics on the current course, like the 
amount of time spent on the course, current grade from the quizzes, and course 
completion. There will also be a list of sections that go into the content of 
a particular section.

5. When reading over the content of each section, time will be tracked. At the 
end of each section will be a quiz, which will update your overall grade upon 
completion, and add to the overall completion of the course.

## Deleting a Course

1. On the homepage, click on "Open an existing course", this will bring you to 
the Open Course page.

2. Find the course that you want to delete, and click on its card.

3. A popup will appear, click the `Delete Course` button, and the course will be 
deleted from the database, the page will refresh with that course deleted.
