import os

class Config:
    log_level: str = "INFO"
    api_ip: str = "0.0.0.0"
    api_port: int = 8000
    db_path: str = 'sqlite://:memory:'
    tests: str = 'False'
    
    @classmethod
    def load_from_env(cls):
        for key, value in cls.__annotations__.items():
            env_value = os.getenv(key.upper())
            if env_value is not None:
                if isinstance(value, int):
                    setattr(cls, key, int(env_value))
                else:
                    setattr(cls, key, env_value)

Config.load_from_env()

if __name__ == "__main__":
    raise RuntimeError("This module should be run only via main.py")
