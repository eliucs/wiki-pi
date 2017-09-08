/**
 * 
 * section.js
 * 
 * Client side code for rendering the section content.
 * 
 */

 $(document).ready(() => {
     // For debugging:
     console.log(sectionData);

     // Render title, section content:
     $('#section-title').html(sectionData.title);

     // Handle button mark as completed:
     $('#btn-mark-completed').click(() => {
        console.log('clicked');
     });
 });
