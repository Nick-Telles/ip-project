import { LitElement, html, css } from 'lit'; 
import '@lrnwebcomponents/accent-card';


export class NasaImage extends LitElement {
  static get tag() {
    return 'nasa-image-search';
  }

  constructor() {
    super();
    this.nasaResults = [];
    this.loadData = false;
    this.view = 'accent-card';
  }


  static get properties() {
    return {
      nasaResults: { type: Array },
      loadData: { type: Boolean, reflect: true, attribute: 'load-data' },
      view: { type: String, reflect: true },
    
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'loadData' && this[propName]) {
        this.getNASAData();
      } else if (propName === 'nasaResults') {
        this.dispatchEvent(
          new CustomEvent('newResults', {
            detail: {
              value: this.nasaResults,
            },
          })
        );
      }
    });
  }
  //I dont know why this small block of code is unreachable
  async getNASAData() {
    return fetch(
      'https://images-api.nasa.gov/search?q=moon%20landing&media_type=image'
    ).then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        this.nasaResults = [];
        
        data.collection.items.forEach(element => {
          
          if (element.links[0].href !==undefined) {
            const moonInfo = {
              imagesrc: element.links[0].href,
              title: element.data[0].title,
              description: element.data[0].description,

            };
            console.log(moonInfo);
            this.nasaResults.push(moonInfo);
          }
        });
        return data;
      });
  }
  
  //also unsure why the render is unreachable, are we just missing a bracket or something?
  render() {
    return html`
  <ul>
      <><li>${item.title}</li><li>${item.imagesrc}</li><li>${item.description}</li></>
  </ul>
    ${this.nasaResults.map(
    
      item => html `
        <accent-card
          image-src="${item.imagesrc}"
          image-align="right"
          horizontal
          style="max-width:600px;"
          >
            <div slot="heading">${item.title}</div><div slot="content">${item.description}</div></>


          </accent-card>
    `
    )}
    `;
  }
}
  
    

customElements.define('nasa-image-search',tag, NasaImage);