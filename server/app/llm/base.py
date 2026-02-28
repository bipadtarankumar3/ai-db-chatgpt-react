from abc import ABC, abstractmethod

class BaseLLM(ABC):
    @abstractmethod
    def chat(self, messages, temperature=0):
        pass

    @abstractmethod
    def embed(self, text):
        pass
