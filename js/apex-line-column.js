// js/apex-line-column.js

import ApexCharts from "apexcharts";
import DataFrame from "dataframe-js";

class ApexLineColumn extends HTMLElement {
  connectedCallback() {
    this.str_random_id = "id_" + Math.random().toString(36).substr(2, 9);
    this.innerHTML = `
      <style>
        @import url(https://fonts.googleapis.com/css?family=Roboto);
        body {
          font-family: Roboto, sans-serif;
        }
        .apex-line-column {
          max-width: 650px;
          margin: 35px auto;
          color: black;
        }
      </style>
      <div class="apex-line-column" id="${this.str_random_id}"></div>
    `;
    this.chart_render();
  }
  async load_config_csv() {
    let df = await DataFrame.fromCSV(this.getAttribute("src"));
    let ary = df.transpose().toArray();
    let ary_keys = ary[0];
    let ary_values = ary[1];
    this.dic_config = {};
    ary_keys.forEach(
      (str_key, i) => (this.dic_config[str_key] = ary_values[i])
    );
  }
  async load_data_csv() {
    let df = await DataFrame.fromCSV(this.dic_config["資料檔案"]);
    df = df.transpose();
    let ary = df.toArray();
    return ary;
  }
  async chart_render() {
    await this.load_config_csv();
    let ary = await this.load_data_csv();
    console.log(this.dic_config);
    let options = {
      series: [
        {
          name: this.dic_config["Y軸左側名稱"],
          type: "column",
          data: ary[1]
        },
        {
          name: this.dic_config["Y軸右側名稱"],
          type: "line",
          data: ary[2]
        }
      ],
      chart: {
        height: 350,
        type: "line"
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: this.dic_config["標題名稱"]
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: ary[0],
      xaxis: {
        type: "string"
      },
      yaxis: [
        {
          title: {
            text: this.dic_config["Y軸左側名稱"]
          }
        },
        {
          opposite: true,
          title: {
            text: this.dic_config["Y軸右側名稱"]
          }
        }
      ]
    };
    let chart = new ApexCharts(
      document.querySelector("#" + this.str_random_id),
      options
    );
    chart.render();
  }
}
customElements.define("apex-line-column", ApexLineColumn);
