import requests


class FCD(object):
    FORMAT = "json"
    API_KEY = "N4ZFGssGZVgxc8ZtBOp11B1pRPkXj57IsvKcGpvL"
    API_URL = "http://api.nal.usda.gov/ndb/{}/?format={}&api_key={}"

    def __init__(self):
        super(FCD, self).__init__()

    @staticmethod
    def get_url(command):
        return FCD.API_URL.format(command, FCD.FORMAT, FCD.API_KEY)

    @staticmethod
    def find(name):
        """
        searchs for the given food

        :return: returns a list of matching food objects
        """
        base_url = FCD.get_url("search")
        url = base_url + "&q={}".format(name)
        json_response = requests.get(url).json()["list"]["item"]
        return json_response

    @staticmethod
    def get_report(ndbno):
        base_url = FCD.get_url("reports")
        url = base_url + "&type=f&ndbno={}".format(ndbno)
        json_response = requests.get(url).json()["report"]
        return json_response

    @staticmethod
    def get_nutrients(ndbno):
        report = FCD.get_report(ndbno)
        return report["food"]["nutrients"]

    @staticmethod
    def get_measures(ndbno):
        nutrients = FCD.get_nutrients(ndbno)
        return set(m["label"] for n in nutrients for m in n["measures"])

    def calculate_consumption(self, ndbno, measure, quantity):
        nutrients = self.get_nutrients(ndbno)
        intake = []
        for nutrient in nutrients:
            for i_measure in nutrient["measures"]:
                if i_measure["label"] == measure and i_measure["value"] != 0:
                    intake.append({
                        "label": nutrient["name"],
                        "unit": nutrient["unit"],
                        "intake": i_measure["value"] * quantity
                    })
        return intake