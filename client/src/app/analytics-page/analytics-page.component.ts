import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { Subscription } from 'rxjs'
import { AnalyticsPage } from '../shared/interfaces'
import { Chart } from 'chart.js'
import { AnalyticsService } from '../shared/services/analytics.service'

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  aSub: Subscription
  average: number
  pending = true

  constructor(private service: AnalyticsService) {}

  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'Profit',
      color: 'rgb(255,99,132)'
    }

    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(54,162,235)'
    }

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map(item => item.gain)

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map(item => item.order)

      // **** Gain ****
      // gainConfig.labels.push('28.11.20')
      // gainConfig.data.push(63)
      // gainConfig.labels.push('29.11.20')
      // gainConfig.data.push(52)
      // **** Gain ****

      // **** Order ****
      // orderConfig.labels.push('28.11.20')
      // orderConfig.data.push(63)
      // orderConfig.labels.push('29.11.20')
      // orderConfig.data.push(52)
      // **** Order ****

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))

      this.pending = false
    })
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }
}

function createChartConfig({ labels, data, label, color }) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          bordercolor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
