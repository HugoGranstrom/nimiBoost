import matplotlib.pyplot as plt
import numpy as np
import streamlit as st
from scipy.stats import norm


"""
<!-- md -->

# What is Statistics

sited by [Wikipedia: Statistics](https://en.wikipedia.org/wiki/Statistics)

> Statistics is the discipline that concerns the collection, organization, analysis, interpretation and presentation of data.[1][2][3] In applying statistics to a scientific, industrial, or social problem, it is conventional to begin with a statistical population or a statistical model to be studied. Populations can be diverse groups of people or objects such as "all people living in a country" or "every atom composing a crystal". Statistics deals with every aspect of data, including the planning of data collection in terms of the design of surveys and experiments.[4] See glossary of probability and statistics.

## Normal Distribution

normal distribution in TeX

$$
  f(x)={\\frac{1}{\sqrt{2\pi \sigma^{2}}}}\exp(-{\\frac {(x-\mu )^{2}}{2\sigma^{2}}})\quad (x\in \mathbb {R})
$$

normal distribution in Python

```python
def norm(mu, sigma, x_i):
    return 1 / (sigma * np.sqrt(2 * np.pi)) * np.exp((- (x_i - mu)**2) / (2 * sigma**2))
```

<!-- end-md -->
"""


@st.cache
def load_data():
    # data: N(50, 20^2)
    mean = 50
    std = 20
    x = np.arange(start=-40, stop=140, step=0.1)
    y = norm.pdf(x, loc=mean, scale=std)
    return mean, std, x, y


def plot(mean, std, x, y):
    # plot
    plt.plot(x, y, color="b")
    plt.title(f"$N(\mu, \sigma^2) = N({mean}, {std}^2)$")
    st.pyplot()


def main():
    mean, std, x, y = load_data()
    plot(mean, std, x, y)


main()
