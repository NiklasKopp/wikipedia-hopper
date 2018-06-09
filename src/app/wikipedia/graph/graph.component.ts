import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Network} from "vis";
import {WikipediaGraphService} from "./wikipedia-graph.service";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @ViewChild('visContainer')
  private visContainer: ElementRef;

  @Input()
  public title: string;

  private network: Network;

  constructor(private graphService: WikipediaGraphService) { }

  ngOnInit() {
    const options = {};
    this.network = new Network(this.visContainer.nativeElement,
      {
      nodes: this.graphService.nodes,
      edges: this.graphService.edges
      }, options);

    this.network.on('click', this.onNodeClicked);
  }

  onSearchClicked() {
    this.graphService.addPage(this.title);
  }

  onNodeClicked = (event: any) => {
    if(event.nodes.length > 0) {
      this.graphService.addLinksFor(event.nodes[0]);
    }
  }
}
