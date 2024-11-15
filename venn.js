let randColors = [];
let randX = [];
let randY = [];
let randR = [];
let opacity = 80;
let activeCourse = null;
let highlightedCircles = [];

// Initialize the Venn Diagram in the center
function setup() {
  const canvasContainer = select("#venn-diagram");
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent(canvasContainer);

  // Generate random values for colors, positions, and radii for each area of study
  areasOfStudy.forEach((area, index) => {
    randColors[index] = [
      random(100, 255),
      random(100, 255),
      random(100, 255),
      opacity,
    ];
    randR[index] = random(100, 200);
    randY[index] = random(height * 0.2, height * 0.8);
    randX[index] = random(width * 0.3, width * 0.7);

    area.x = randX[index];
    area.y = randY[index];
    area.r = randR[index];
    area.color = randColors[index];
  });
  background(200);
  renderCourseList();
  renderAreas();
  plotCourseDots();
}

function draw() {
  // Clear the background and redraw areas and highlighted circles
  background(200);
  renderAreas();

  // Draw any highlighted circles from the active course
  highlightedCircles.forEach((area) => {
    fill(area.color[0], area.color[1], area.color[2], 100); // Higher opacity for highlight
    stroke(area.color[0], area.color[1], area.color[2]);
    ellipse(area.x, area.y, area.r * 2);
  });

  plotCourseDots();

  if (activeCourse) {
    drawConnections();
  }
}

function renderAreas() {
  areasOfStudy.forEach((area) => {
    fill(...area.color);
    noStroke();
    ellipse(area.x, area.y, area.r * 2);
  });
}

function renderCourseList() {
  const courseListDiv = select("#course-list");

  courses.forEach((course) => {
    const courseItem = createDiv(course.name)
      .parent(courseListDiv)
      .addClass("p-2 my-2 cursor-pointer hover:shadow rounded text-gray-800");

    courseItem.mousePressed(() => toggleCourseDescription(course, courseItem));
  });
}

function toggleCourseDescription(course, courseItem) {
  // Clear the shadow class from all items first
  if (highlightedCircles.length > 0) {
    highlightedCircles = [];
  }
  selectAll("#course-list div").forEach((el) => {
    el.removeClass("shadow-lg");
    el.removeClass("border");
    el.removeClass("border-gray-900");
  });
  if (activeCourse === course) {
    activeCourse = null;
    clearHighlights();
  } else {
    activeCourse = course;
    highlightTags(course.tags);
    plotCourseDots();
    courseItem.addClass("shadow-lg border border-gray-900"); // Add shadow class to highlight the selected course
  }
}

function highlightTags(tags) {
  clearHighlights();

  tags.forEach((tag) => {
    const area = areasOfStudy.find((area) => area.tag === tag);
    if (area) {
      highlightedCircles.push(area); // Add area to highlighted circles array
      displayDescription(area);
    }
  });
}

function highlightCircle(area) {
  print("highlight: " + area.name);
  // fill(area.color[0], area.color[1], area.color[2], 250);
  // stroke(0, 0, 255);
  // strokeWidth(10);
  // ellipse(area.x, area.y, area.r * 2);
}

function clearHighlights() {
  selectAll(".description").forEach((el) => el.remove());
  background(255);
  renderAreas();
  plotCourseDots();
}

function displayDescription(area) {
  const descriptionBox = select("#description-box");

  const descriptionDiv = createDiv()
    .parent(descriptionBox)
    .addClass(
      "description p-2 mb-2 shadow-lg rounded bg-gray-300 bg-opacity-50"
    );

  descriptionDiv.html(`<strong>${area.name}</strong>: ${area.description}`);
}

function plotCourseDots() {
  courses.forEach((course) => {
    let avgX = 0;
    let avgY = 0;
    let count = 0;

    // Calculate the average center based on the tagged areas
    course.tags.forEach((tag) => {
      const area = areasOfStudy.find((area) => area.tag === tag);
      if (area) {
        avgX += area.x;
        avgY += area.y;
        count++;
      }
    });

    if (count > 0) {
      avgX /= count;
      avgY /= count;

      // Set dot color based on whether the course is active
      if (activeCourse === course) {
        fill(255, 0, 0); // Red dot for the active course
      } else {
        fill(0, 0, 0); // Black dot for other courses
      }

      noStroke();
      ellipse(avgX, avgY, 10, 10); // Dot size is 10 pixels

      // Store the average position to use in connection drawing
      course.avgX = avgX;
      course.avgY = avgY;
    }
  });
}

function drawConnections() {
  if (activeCourse) {
    // Connect Course List Item to Dot
    const courseListItem = document.querySelector(
      `#course-list div:nth-child(${courses.indexOf(activeCourse) + 1})`
    );
    if (courseListItem) {
      const courseItemPos = courseListItem.getBoundingClientRect();
      strokeWeight(1);
      stroke(0); // Fixed red color for this line
      line(
        courseItemPos.right,
        courseItemPos.top + courseItemPos.height / 2,
        activeCourse.avgX,
        activeCourse.avgY
      );
    }

    // Connect the centers of tagged circles
    let lastCenter = null;
    activeCourse.tags.forEach((tag) => {
      const area = areasOfStudy.find((area) => area.tag === tag);
      if (area) {
        if (lastCenter) {
          // Set stroke to the area's color for line between centers
          stroke(area.color[0], area.color[1], area.color[2], 150);
          strokeWeight(2);
          line(lastCenter.x, lastCenter.y, area.x, area.y);
        }
        lastCenter = { x: area.x, y: area.y };
      }
    });

    // Connect Area Circles to Area Descriptions
    const descriptionBox = document.getElementById("description-box");
    if (descriptionBox) {
      const descriptions = descriptionBox.querySelectorAll(".description");
      activeCourse.tags.forEach((tag, index) => {
        const area = areasOfStudy.find((area) => area.tag === tag);
        if (area) {
          const desc = descriptions[index];
          const rect = desc.getBoundingClientRect();
          stroke(area.color[0], area.color[1], area.color[2], 150); // Line color matches highlighted circle
          line(area.x, area.y, rect.left, rect.top + rect.height / 2);
        }
      });
    }
  }
}
