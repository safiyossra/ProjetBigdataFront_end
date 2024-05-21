
import { CustomerService } from '../customer.service';
import { Customer } from '../customer.model';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Component, ElementRef, Renderer2, OnInit } from '@angular/core';

Chart.register(...registerables);
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'] ,
  standalone: true,
  imports: [CommonModule]
  

})
export class GRAPHComponent implements OnInit {
  charts: { [key: string]: Chart } = {};
  private stateMapping: { [key: number]: string } = {
    1: 'KS', 2: 'OH', 3: 'NJ', 4: 'OK', 5: 'AL',
    6: 'MA', 7: 'MO', 8: 'WV', 9: 'RI', 10: 'IA',
    11: 'MT', 12: 'ID', 13: 'VT', 14: 'VA', 15: 'TX',
    16: 'FL', 17: 'CO', 18: 'AZ', 19: 'NE', 20: 'WY',
    21: 'IL', 22: 'NH', 23: 'LA', 24: 'GA', 25: 'AK',
    26: 'MD', 27: 'AR', 28: 'WI', 29: 'OR', 30: 'DE',
    31: 'IN', 32: 'UT', 33: 'CA', 34: 'SD', 35: 'NC',
    36: 'WA', 37: 'MN', 38: 'NM', 39: 'NV', 40: 'DC',
    41: 'NY', 42: 'KY', 43: 'ME', 44: 'MS', 45: 'MI',
    46: 'SC', 47: 'TN', 48: 'PA', 49: 'HI', 50: 'ND',
    51: 'CT'
  };
  private attributes: (keyof Customer)[] = [
    'numberVmailMessages', 'totalDayMinutes', 'totalDayCalls', 'totalDayCharge',
    'totalEveMinutes', 'totalEveCalls', 'totalEveCharge', 'totalNightMinutes',
    'totalNightCalls', 'totalNightCharge', 'totalIntlMinutes', 'totalIntlCalls',
    'totalIntlCharge'
  ];
  
  constructor(private customerService: CustomerService,private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe(customers => {
      this.createSubscriptionChart(customers);
      this.createChurnGraph(customers, 'voiceMailPlan', 'Voice mail plan');
      this.createChurnGraph(customers, 'internationalPlan', 'International Plan');
      this.createAllAttributesVsChurnGraph(customers);
      this.createInternationalPlanPieChart(customers);
      this.createStatePieChart(customers);
      this.createSubUnsubChart(customers);
      this.loadPredictionAccuracy();
      this.createTotalDayCallsChart(customers);
      this.loadPrediction();
      this.createChart(customers, 'totalDayCharge', 'Total Day Charge vs Churn', 'totalDayChargeChart');
      this.createChart(customers, 'totalEveMinutes', 'Total Evening Minutes vs Churn', 'totalEveMinutesChart');
      this.createChart(customers, 'totalEveCalls', 'Total Evening Calls vs Churn', 'totalEveCallsChart');
      this.createChart(customers, 'totalEveCharge', 'Total Evening Charge vs Churn', 'totalEveChargeChart');

      this.createChart2(customers, 'totalNightMinutes', 'Total Night Minutes vs Churn', 'totalNightMinutesChart');
      this.createChart2(customers, 'totalNightCalls', 'Total Night Calls vs Churn', 'totalNightCallsChart');
      this.createChart2(customers, 'totalNightCharge', 'Total Night Charge vs Churn', 'totalNightChargeChart');
      this.createChart2(customers, 'totalIntlMinutes', 'Total Intl Minutes vs Churn', 'totalIntlMinutesChart');
      this.createChart2(customers, 'totalIntlCalls', 'Total Intl Calls vs Churn', 'totalIntlCallsChart');
      this.createChart2(customers, 'totalIntlCharge', 'Total Intl Charge vs Churn', 'totalIntlChargeChart');

    });
  }

  //Graphe Abonnés et Désabonnés
  createSubscriptionChart(customers: Customer[]): void {
    const subscribers = customers.filter(c => c.churn === 0).length;
    const churned = customers.filter(c => c.churn === 1).length;

    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: ['Abonnés', 'Désabonnés'],
        datasets: [{
          label: 'Statut des clients',
          data: [subscribers, churned],
          backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
          borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    const ctx = document.getElementById('subscriptionChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, config);
    } else {
      console.error('Canvas with ID "subscriptionChart" not found.');
    }
  }

//Graphe internationalPlan and voiceMailPlan
  createChurnGraph(customers: Customer[], attribute: keyof Customer, label: string): void {
    const attributeValues = customers.map(c => c[attribute]);
    let uniqueValues = Array.from(new Set(attributeValues)).sort();

    // Check if the attribute is 'internationalPlan' or 'voiceMailPlan' for custom labels
    const isBinaryAttribute = attribute === 'internationalPlan' || attribute === 'voiceMailPlan';
    const labels = isBinaryAttribute ? uniqueValues.map(value => value === 1 ? 'Yes' : 'No') : uniqueValues.map(value => value.toString());

    const churnRates = uniqueValues.map(value => {
      const relevantCustomers = customers.filter(c => c[attribute] === value);
      const churned = relevantCustomers.filter(c => c.churn === 1).length;
      return (churned / relevantCustomers.length) * 100; // Churn rate in percentage
    });

    const config: ChartConfiguration<'bar', number[], string> = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: `${label} vs Churn Rate`,
          data: churnRates,
          backgroundColor: ['rgba(240, 192, 192, 0.5)','rgba(240, 200, 238, 0.8)'],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Churn Rate (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: label
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    };

    const canvasId = `${attribute}-chart`;
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, config);
    } else {
      console.error(`Canvas with ID "${canvasId}" not found.`);
    }
}




createAllAttributesVsChurnGraph(customers: Customer[]): void {
  const churnedData: number[] = [];
  const notChurnedData: number[] = [];

  // Calculer les données pour chaque attribut
  this.attributes.forEach(attribute => {
    const churnedValues = customers.filter(c => c.churn === 1).map(c => +c[attribute]);
    const notChurnedValues = customers.filter(c => c.churn === 0).map(c => +c[attribute]);
    
    churnedData.push(churnedValues.reduce((sum, current) => sum + current, 0) / (churnedValues.length || 1));
    notChurnedData.push(notChurnedValues.reduce((sum, current) => sum + current, 0) / (notChurnedValues.length || 1));
  });

  // Configuration du graphique
  const config: ChartConfiguration<'bar', number[], string> = {
    type: 'bar',
    data: {
      labels: this.attributes,
      datasets: [
        {
          label: 'Churned',
          data: churnedData,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        },
        {
          label: 'Not Churned',
          data: notChurnedData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Average Value'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Attributes'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  };

  // Création du graphique dans le canvas spécifié
  const ctx = document.getElementById('attributesVsChurnChart') as HTMLCanvasElement;
  if (ctx) {
    if (this.charts['attributesVsChurnChart']) {
      this.charts['attributesVsChurnChart'].destroy();
    }
    this.charts['attributesVsChurnChart'] = new Chart(ctx, config);
  } else {
    console.error('Canvas with ID "attributesVsChurnChart" not found.');
  }
}

// Méthode pour créer un diagramme circulaire pour les plans internationaux
createInternationalPlanPieChart(customers: Customer[]): void {
  const withPlan = customers.filter(c => c.internationalPlan === 1).length;
  const withoutPlan = customers.length - withPlan;

  const config: ChartConfiguration<'pie', number[], string> = {
      type: 'pie',
      data: {
          labels: ['Avec Plan International', 'Sans Plan International'],
          datasets: [{
              data: [withPlan, withoutPlan],
              backgroundColor: ['rgba(255, 206, 86, 0.2)', 'rgba(54, 162, 235, 0.2)'],
              borderColor: ['rgba(255, 206, 86, 1)', 'rgba(54, 162, 235, 1)'],
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          plugins: {
              legend: {
                  position: 'top',
              },
              tooltip: {
                  mode: 'index',
                  intersect: false,
              }
          }
      }
  };

  const ctx = document.getElementById('internationalPlanPieChart') as HTMLCanvasElement;
  if (ctx) {
      new Chart(ctx, config);
  } else {
      console.error('Canvas with ID "internationalPlanPieChart" not found.');
  }
}




// Méthode pour créer un diagramme circulaire pour la répartition par État
createStatePieChart(customers: Customer[]): void {
  // Calculate the number of customers per state using state names from the mapping
  const stateCounts = customers.reduce((acc, cur) => {
    const stateName = this.stateMapping[cur.state] || 'Unknown';  // Use the state mapping
    acc[stateName] = (acc[stateName] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const stateLabels = Object.keys(stateCounts);
  const stateData = Object.values(stateCounts);

  // Generate random colors for each state
  const backgroundColors = stateLabels.map(() => `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);
  const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));

  const config: ChartConfiguration<'pie', number[], string> = {
    type: 'pie',
    data: {
      labels: stateLabels,
      datasets: [{
        data: stateData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      }
    }
  };

  const ctx = document.getElementById('statePieChart') as HTMLCanvasElement;
  if (ctx) {
    new Chart(ctx, config);
  } else {
    console.error('Canvas with ID "statePieChart" not found.');
  }
}

createSubUnsubChart(customers: Customer[]): void {
  const ranges = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]; // Adjust these ranges as needed
  const subscriberCounts = new Array(ranges.length - 1).fill(0);
  const unsubscriberCounts = new Array(ranges.length - 1).fill(0);

  customers.forEach(customer => {
    const index = ranges.findIndex(range => customer.totalDayMinutes < range) - 1;
    if (index >= 0) { // Make sure the index is valid
      if (customer.churn === 1) {
        unsubscriberCounts[index]++;
      } else {
        subscriberCounts[index]++;
      }
    }
  });

  const dataLabels = ranges.slice(1).map((range, index) => `${ranges[index]}-${range}`);

  const config: ChartConfiguration<'bar', number[], string> = {
    type: 'bar',
    data: {
      labels: dataLabels,
      datasets: [
        {
          label: 'Subscribers',
          data: subscriberCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        },
        {
          label: 'Unsubscribers',
          data: unsubscriberCounts,
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }
      ]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Total Day Minutes'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Count'
          }
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  };

  const ctx = document.getElementById('subUnsubChart') as HTMLCanvasElement;
  if (ctx) {
    new Chart(ctx, config);
  } else {
    console.error('Canvas with ID "subUnsubChart" not found.');
  }
}
createTotalDayCallsChart(customers: Customer[]): void {
  const ranges = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]; // Adjust these ranges as needed
  const subscriberCounts = new Array(ranges.length - 1).fill(0);
  const unsubscriberCounts = new Array(ranges.length - 1).fill(0);

  customers.forEach(customer => {
    const index = ranges.findIndex(range => customer.totalDayCalls < range) - 1;
    if (index >= 0) { // Make sure the index is valid
      if (customer.churn === 1) {
        unsubscriberCounts[index]++;
      } else {
        subscriberCounts[index]++;
      }
    }
  });

  const dataLabels = ranges.slice(1).map((range, index) => `${ranges[index]}-${range}`);

  const config: ChartConfiguration<'bar', number[], string> = {
    type: 'bar',
    data: {
      labels: dataLabels,
      datasets: [
        {
          label: 'Subscribers',
          data: subscriberCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Changed color for variety
          borderColor: 'rgba(75, 192, 192, 1)', 
          borderWidth: 1
        },
        {
          label: 'Unsubscribers',
          data: unsubscriberCounts,
          backgroundColor: 'rgba(153, 102, 255, 0.6)', // Changed color for variety
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Total Day Calls Range'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Customers'
          }
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  };

  const ctx = document.getElementById('totalDayCallsChart') as HTMLCanvasElement;
  if (ctx) {
    new Chart(ctx, config);
  } else {
    console.error('Canvas with ID "totalDayCallsChart" not found.');
  }
}


createChart(customers: Customer[], key: keyof Customer, label: string, canvasId: string): void {
  const churned = customers.filter(c => c.churn === 1).map(c => c[key] as number); // Assert as number
  const retained = customers.filter(c => c.churn === 0).map(c => c[key] as number); // Assert as number

  const config: ChartConfiguration<'bar', number[], string> = {
    type: 'bar',
    data: {
      labels: ['Churned', 'Retained'],
      datasets: [{
        label: label,
        data: [this.average(churned), this.average(retained)],
        backgroundColor: ['rgba(210, 167, 189, 0.8)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Average Value'
          }
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  };

  const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
  if (ctx) {
    new Chart(ctx, config);
  } else {
    console.error(`Canvas with ID "${canvasId}" not found.`);
  }
}

average(data: number[]): number {
  return data.length ? data.reduce((sum, current) => sum + current, 0) / data.length : 0;
}

createChart2(customers: Customer[], key: keyof Customer, label: string, canvasId: string): void {
  const churned = customers.filter(c => c.churn === 1).map(c => c[key] as number);
  const retained = customers.filter(c => c.churn === 0).map(c => c[key] as number);

  const config: ChartConfiguration<'bar', number[], string> = {
    type: 'bar',
    data: {
      labels: ['Churned', 'Retained'],
      datasets: [{
        label: label,
        data: [this.average(churned), this.average(retained)],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(174, 242, 233, 0.8)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Average Value'
          }
        }
      },
      plugins: {
      legend: {
          display: true
      }
      }
    }
  };

  const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
  if (ctx) {
    new Chart(ctx, config);
  } else {
    console.error(`Canvas with ID "${canvasId}" not found.`);
  }
}

average2(data: number[]): number {
  return data.length ? data.reduce((sum, current) => sum + current, 0) / data.length : 0;
}
createPredictionChart(correct: number, incorrect: number): void {
  const data: ChartConfiguration['data'] = {
    labels: ['Correct', 'Incorrect'],
    datasets: [{
      label: 'Prediction Accuracy',
      data: [correct, incorrect],
      backgroundColor: ['rgba(23, 217, 170, 0.8)', 'rgba(196, 217, 240, 0.8)']
    }]
  };

  const config: ChartConfiguration = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  const ctx = document.getElementById('predictionChart') as HTMLCanvasElement;
  new Chart(ctx, config);
}
private loadPredictionAccuracy(): void {
  this.customerService.getPredictionAccuracy().subscribe({
    next: ({ correct, incorrect }) => {
      this.createPredictionChart(correct, incorrect);
    },
    error: (err) => console.error('Error fetching prediction accuracy:', err)
  });
}

renderChurnPredictionChart(correct: number, incorrect: number): void {
  const data: ChartConfiguration['data'] = {
    labels: ['Correct', 'Incorrect'],
    datasets: [{
      label: 'Churn Prediction Accuracy',
      data: [correct, incorrect],
      backgroundColor: ['rgba(199, 249, 201, 0.8)', 'rgba(196, 217, 240, 0.8)']
    }]
  };

  const config: ChartConfiguration = {
    type: 'pie',  // Changed from 'bar' to 'pie' for a circular diagram
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'  // Adjust legend position as needed
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      }
    }
  };

  const ctx = document.getElementById('predictionChart2') as HTMLCanvasElement;
  new Chart(ctx, config);

}
private loadPrediction(): void {
  this.customerService.getPredictionAccuracy().subscribe({
    next: ({ correct, incorrect }) => {
      this.renderChurnPredictionChart(correct, incorrect);  // Updated function name here
    },
    error: (err) => console.error('Error fetching prediction accuracy:', err)
  });
}


}